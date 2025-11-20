"""
Claude Multi-Agent Client for Office Hours Oracle
Three specialized agents: Analyzer, Matcher, Synthesizer
"""
import os
import json
from typing import List, Dict, Any
from anthropic import Anthropic
from models import AnalyzerOutput, MatcherOutput, SynthesizerOutput, DifficultyLevel

# Toggle for mock mode during development
USE_MOCK = os.getenv("USE_MOCK_CLAUDE", "false").lower() == "true"

# Initialize Anthropic client
client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY")) if not USE_MOCK else None

MODEL = "claude-3-5-sonnet-20241022"
MAX_TOKENS = 1000


# ============================================================================
# AGENT 1: QUESTION ANALYZER
# ============================================================================

ANALYZER_SYSTEM_PROMPT = """You are the Question Analyzer agent for a CS office hours optimization system.

Your job: Analyze student questions and extract structured metadata.

Output ONLY valid JSON with this exact schema:
{
  "category": "string - specific topic like 'Red-Black Tree Deletion' or 'Segfault in C Pointers'",
  "estimated_difficulty": "LOW | MEDIUM | HIGH",
  "estimated_time_minutes": integer between 5-30,
  "tags": ["list", "of", "relevant", "keywords"],
  "brief_summary": "1-2 sentence description of the core problem"
}

Rules:
- Be specific with category (not just "Data Structures" but "AVL Tree Rotations")
- estimated_time_minutes: LOW=5-10min, MEDIUM=10-20min, HIGH=20-30min
- tags: 3-7 keywords that would help match to TA expertise
- If code is provided, incorporate it into your analysis
- Output MUST be valid JSON only, no markdown, no explanation"""


def analyze_question(student_name: str, course: str, question_text: str,
                     code_snippet: str = None) -> AnalyzerOutput:
    """
    Agent 1: Analyze question and extract metadata
    """
    if USE_MOCK:
        return _mock_analyzer(question_text)

    user_message = f"""Student: {student_name}
Course: {course}
Question: {question_text}"""

    if code_snippet:
        user_message += f"\n\nCode:\n{code_snippet}"

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=ANALYZER_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}]
        )

        result = json.loads(response.content[0].text)
        return AnalyzerOutput(**result)

    except Exception as e:
        print(f"Analyzer error: {e}")
        return _mock_analyzer(question_text)


def _mock_analyzer(question_text: str) -> AnalyzerOutput:
    """Fallback mock for demos"""
    return AnalyzerOutput(
        category="General CS Question",
        estimated_difficulty=DifficultyLevel.MEDIUM,
        estimated_time_minutes=15,
        tags=["debugging", "general"],
        brief_summary=f"Student needs help with: {question_text[:100]}"
    )


# ============================================================================
# AGENT 2: TA MATCHER
# ============================================================================

MATCHER_SYSTEM_PROMPT = """You are the TA Matcher agent for a CS office hours optimization system.

Your job: Match questions to the best available TA based on expertise and current queue load.

Output ONLY valid JSON with this exact schema:
{
  "recommended_ta_id": integer,
  "alternative_tas": [list of integer TA IDs],
  "priority_score": float between 0-100,
  "rationale": "brief explanation of why this TA is best"
}

Matching criteria (in order of importance):
1. Expertise match (tags overlap with TA expertise)
2. Current queue length (prefer TAs with shorter queues)
3. Estimated difficulty vs TA specialization
4. Student preference (if provided)

Rules:
- recommended_ta_id: the single best TA
- alternative_tas: 1-2 backup options
- priority_score: higher = better match (100 = perfect expert with no queue)
- Output MUST be valid JSON only, no markdown"""


def match_ta(analyzer_output: AnalyzerOutput, tas: List[Dict], queue_counts: Dict[int, int],
             preferred_ta_id: int = None) -> MatcherOutput:
    """
    Agent 2: Match question to optimal TA
    """
    if USE_MOCK:
        return _mock_matcher(tas)

    tas_info = "\n".join([
        f"TA {ta['id']}: {ta['name']} | Expertise: {', '.join(ta['expertise_tags'])} | Queue: {queue_counts.get(ta['id'], 0)} students"
        for ta in tas
    ])

    user_message = f"""Question Analysis:
Category: {analyzer_output.category}
Difficulty: {analyzer_output.estimated_difficulty}
Estimated Time: {analyzer_output.estimated_time_minutes} minutes
Tags: {', '.join(analyzer_output.tags)}
Summary: {analyzer_output.brief_summary}

Available TAs:
{tas_info}
"""

    if preferred_ta_id:
        user_message += f"\nStudent prefers TA ID: {preferred_ta_id}"

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=MATCHER_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}]
        )

        result = json.loads(response.content[0].text)
        return MatcherOutput(**result)

    except Exception as e:
        print(f"Matcher error: {e}")
        return _mock_matcher(tas)


def _mock_matcher(tas: List[Dict]) -> MatcherOutput:
    """Fallback mock for demos"""
    return MatcherOutput(
        recommended_ta_id=tas[0]['id'] if tas else 1,
        alternative_tas=[tas[1]['id']] if len(tas) > 1 else [],
        priority_score=85.0,
        rationale="Mock match - would use expertise and queue analysis in production"
    )


# ============================================================================
# AGENT 3: SOLUTION SYNTHESIZER
# ============================================================================

SYNTHESIZER_SYSTEM_PROMPT = """You are the Solution Synthesizer agent for a CS office hours optimization system.

Your job: Analyze similar past questions and provide guidance to TAs and students.

Output ONLY valid JSON with this exact schema:
{
  "similar_question_ids": [list of integer IDs],
  "similarity_explanation": "why these questions are relevant",
  "suggested_answer_outline": "bullet-point plan for TA to explain/solve (3-5 steps)",
  "student_friendly_hint": "non-spoiler hint for student while they wait"
}

Rules:
- similar_question_ids: IDs from the knowledge base that are most relevant
- suggested_answer_outline: Step-by-step teaching approach (not full solution)
- student_friendly_hint: Point student in right direction without giving away answer
- Output MUST be valid JSON only, no markdown"""


def synthesize_solution(question_text: str, analyzer_output: AnalyzerOutput,
                       similar_kb_entries: List[Dict]) -> SynthesizerOutput:
    """
    Agent 3: Synthesize solution guidance from KB
    """
    if USE_MOCK:
        return _mock_synthesizer(similar_kb_entries)

    kb_info = "\n\n".join([
        f"KB Entry {entry['id']}:\nCategory: {entry['category']}\nTags: {', '.join(entry['tags'])}\nSummary: {entry['summary']}\nOutline: {entry['solution_outline']}"
        for entry in similar_kb_entries[:3]
    ]) if similar_kb_entries else "No similar questions in knowledge base yet."

    user_message = f"""Current Question:
Text: {question_text}
Category: {analyzer_output.category}
Tags: {', '.join(analyzer_output.tags)}
Summary: {analyzer_output.brief_summary}

Similar Past Questions:
{kb_info}
"""

    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=SYNTHESIZER_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}]
        )

        result = json.loads(response.content[0].text)
        return SynthesizerOutput(**result)

    except Exception as e:
        print(f"Synthesizer error: {e}")
        return _mock_synthesizer(similar_kb_entries)


def _mock_synthesizer(kb_entries: List[Dict]) -> SynthesizerOutput:
    """Fallback mock for demos"""
    return SynthesizerOutput(
        similar_question_ids=[entry['id'] for entry in kb_entries[:2]],
        similarity_explanation="These questions share similar concepts and debugging approaches",
        suggested_answer_outline="1. Identify the core concept\n2. Walk through example\n3. Debug together\n4. Verify understanding",
        student_friendly_hint="Think about the base case and how the structure maintains its invariants"
    )
