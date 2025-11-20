"""
Office Hours Oracle - FastAPI Backend
Multi-agent Claude system for optimizing CS office hours
"""
import os
from typing import List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import json

from models import (
    QuestionSubmission, QuestionResponse, TAInfo, QueueEntryResponse,
    QueueStatus, AnalyzerOutput
)
from db import db
from claude_client import analyze_question, match_ta, synthesize_solution

load_dotenv()

app = FastAPI(title="Office Hours Oracle")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================================
# WebSocket Connection Manager
# ============================================================================

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Broadcast queue updates to all connected clients"""
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                pass


manager = ConnectionManager()


# ============================================================================
# Helper Functions
# ============================================================================

def get_queue_response(queue_entry) -> QueueEntryResponse:
    """Convert queue entry to response format"""
    question = db.get_question(queue_entry.question_id)
    ta = db.get_ta(queue_entry.assigned_ta_id)

    # Get analyzer output if available (stored in question for demo)
    analyzer_output = getattr(question, 'analyzer_output', None)
    synthesizer_output = getattr(question, 'synthesizer_output', None)

    return QueueEntryResponse(
        queue_id=queue_entry.id,
        student_name=question.student_name,
        course=question.course,
        question_text=question.text,
        code_snippet=question.code,
        category=analyzer_output.category if analyzer_output else "General",
        tags=analyzer_output.tags if analyzer_output else [],
        estimated_time_minutes=queue_entry.estimated_time_minutes,
        assigned_ta_name=ta.name if ta else "Unknown",
        status=queue_entry.status,
        brief_summary=analyzer_output.brief_summary if analyzer_output else "",
        suggested_answer_outline=synthesizer_output.suggested_answer_outline if synthesizer_output else None,
        student_friendly_hint=synthesizer_output.student_friendly_hint if synthesizer_output else None
    )


async def broadcast_queue_update():
    """Send current queue state to all WebSocket clients"""
    queue_data = {
        "type": "queue_update",
        "queue": [get_queue_response(entry).dict() for entry in db.get_active_queue()]
    }
    await manager.broadcast(queue_data)


# ============================================================================
# REST Endpoints
# ============================================================================

@app.get("/")
async def root():
    return {"message": "Office Hours Oracle API", "status": "running"}


@app.get("/api/tas", response_model=List[TAInfo])
async def get_tas():
    """Get all active TAs with current queue counts"""
    tas = db.get_all_tas()
    return [
        TAInfo(
            id=ta.id,
            name=ta.name,
            expertise_tags=ta.expertise_tags,
            current_queue_count=db.get_ta_queue_count(ta.id)
        )
        for ta in tas
    ]


@app.post("/api/questions", response_model=QuestionResponse)
async def submit_question(submission: QuestionSubmission):
    """
    Submit a new question - triggers multi-agent Claude workflow:
    1. Analyzer: Extract metadata
    2. Matcher: Assign to best TA
    3. Synthesizer: Find similar solutions
    """
    print(f"\n{'='*60}")
    print(f"NEW QUESTION from {submission.student_name}")
    print(f"{'='*60}")

    # AGENT 1: Analyze Question
    print("\n[AGENT 1: ANALYZER] Analyzing question...")
    analyzer_output = analyze_question(
        submission.student_name,
        submission.course,
        submission.question_text,
        submission.code_snippet
    )
    print(f"  Category: {analyzer_output.category}")
    print(f"  Difficulty: {analyzer_output.estimated_difficulty}")
    print(f"  Est. Time: {analyzer_output.estimated_time_minutes}min")
    print(f"  Tags: {', '.join(analyzer_output.tags)}")

    # AGENT 2: Match to TA
    print("\n[AGENT 2: MATCHER] Finding best TA...")
    tas = db.get_all_tas()
    tas_dict = [{"id": ta.id, "name": ta.name, "expertise_tags": ta.expertise_tags} for ta in tas]
    queue_counts = {ta.id: db.get_ta_queue_count(ta.id) for ta in tas}

    matcher_output = match_ta(
        analyzer_output,
        tas_dict,
        queue_counts,
        submission.preferred_ta_id
    )
    print(f"  Matched to TA: {db.get_ta(matcher_output.recommended_ta_id).name}")
    print(f"  Priority Score: {matcher_output.priority_score}")
    print(f"  Rationale: {matcher_output.rationale}")

    # AGENT 3: Synthesize Solution from KB
    print("\n[AGENT 3: SYNTHESIZER] Searching knowledge base...")
    similar_kb = db.search_kb(analyzer_output.tags, analyzer_output.category)
    similar_kb_dict = [
        {
            "id": kb.id,
            "category": kb.category,
            "tags": kb.tags,
            "summary": kb.summary,
            "solution_outline": kb.solution_outline
        }
        for kb in similar_kb
    ]

    synthesizer_output = synthesize_solution(
        submission.question_text,
        analyzer_output,
        similar_kb_dict
    )
    print(f"  Similar questions: {len(synthesizer_output.similar_question_ids)}")
    print(f"  Hint: {synthesizer_output.student_friendly_hint[:80]}...")

    # Save to database
    question = db.add_question(
        submission.student_name,
        submission.course,
        submission.question_text,
        submission.code_snippet,
        submission.preferred_ta_id
    )

    # Store agent outputs for later retrieval (hackathon shortcut)
    question.analyzer_output = analyzer_output
    question.synthesizer_output = synthesizer_output

    queue_entry = db.add_to_queue(
        question.id,
        matcher_output.recommended_ta_id,
        analyzer_output.estimated_time_minutes
    )

    # Broadcast queue update via WebSocket
    await broadcast_queue_update()

    print(f"\n{'='*60}\n")

    # Return response to student
    assigned_ta = db.get_ta(matcher_output.recommended_ta_id)
    return QuestionResponse(
        queue_id=queue_entry.id,
        assigned_ta_name=assigned_ta.name,
        estimated_wait_minutes=analyzer_output.estimated_time_minutes,
        category=analyzer_output.category,
        tags=analyzer_output.tags,
        brief_summary=analyzer_output.brief_summary,
        similar_questions=synthesizer_output.similar_question_ids
    )


@app.get("/api/queue", response_model=List[QueueEntryResponse])
async def get_queue():
    """Get current queue state"""
    active_queue = db.get_active_queue()
    return [get_queue_response(entry) for entry in active_queue]


@app.post("/api/queue/{queue_id}/resolve")
async def resolve_question(queue_id: int):
    """
    Mark question as resolved and add to knowledge base
    """
    queue_entry = db.get_queue_entry(queue_id)
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    question = db.get_question(queue_entry.question_id)
    analyzer_output = getattr(question, 'analyzer_output', None)
    synthesizer_output = getattr(question, 'synthesizer_output', None)

    # Update queue status
    db.update_queue_status(queue_id, QueueStatus.DONE)

    # Add to knowledge base
    if analyzer_output and synthesizer_output:
        db.add_kb_entry(
            question.id,
            analyzer_output.category,
            analyzer_output.tags,
            analyzer_output.brief_summary,
            synthesizer_output.suggested_answer_outline
        )

    # Broadcast update
    await broadcast_queue_update()

    return {"status": "resolved", "queue_id": queue_id}


@app.get("/api/metrics")
async def get_metrics():
    """
    Calculate simple metrics for demo
    """
    total_questions = len(db.questions)
    resolved_count = sum(1 for entry in db.queue if entry.status == QueueStatus.DONE)

    # Mock calculation: assume random assignment would add 5 min avg vs optimized
    estimated_time_saved = resolved_count * 5

    return {
        "total_questions": total_questions,
        "resolved_count": resolved_count,
        "active_queue_count": len(db.get_active_queue()),
        "estimated_time_saved_minutes": estimated_time_saved,
        "knowledge_base_size": len(db.kb_entries)
    }


# ============================================================================
# WebSocket Endpoint
# ============================================================================

@app.websocket("/ws/queue")
async def websocket_queue(websocket: WebSocket):
    """
    WebSocket endpoint for real-time queue updates
    """
    await manager.connect(websocket)
    print(f"WebSocket connected. Total connections: {len(manager.active_connections)}")

    try:
        # Send initial queue state
        queue_data = {
            "type": "queue_update",
            "queue": [get_queue_response(entry).dict() for entry in db.get_active_queue()]
        }
        await websocket.send_json(queue_data)

        # Keep connection alive
        while True:
            # Wait for messages (client can send pings)
            data = await websocket.receive_text()

    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"WebSocket disconnected. Total connections: {len(manager.active_connections)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
