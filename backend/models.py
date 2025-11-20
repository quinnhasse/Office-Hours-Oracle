"""
Data models for Office Hours Oracle
Simple in-memory storage for hackathon demo
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from enum import Enum


class DifficultyLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class QueueStatus(str, Enum):
    QUEUED = "QUEUED"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"


# Database Models (in-memory)
class TA:
    def __init__(self, id: int, name: str, expertise_tags: List[str], is_active: bool = True):
        self.id = id
        self.name = name
        self.expertise_tags = expertise_tags
        self.is_active = is_active


class Question:
    def __init__(self, id: int, student_name: str, course: str, text: str,
                 code: Optional[str] = None, preferred_ta_id: Optional[int] = None):
        self.id = id
        self.student_name = student_name
        self.course = course
        self.text = text
        self.code = code
        self.preferred_ta_id = preferred_ta_id
        self.created_at = datetime.now()


class QueueEntry:
    def __init__(self, id: int, question_id: int, assigned_ta_id: int,
                 estimated_time_minutes: int, status: QueueStatus = QueueStatus.QUEUED):
        self.id = id
        self.question_id = question_id
        self.assigned_ta_id = assigned_ta_id
        self.estimated_time_minutes = estimated_time_minutes
        self.status = status
        self.created_at = datetime.now()


class KBEntry:
    def __init__(self, id: int, question_id: int, category: str, tags: List[str],
                 summary: str, solution_outline: str):
        self.id = id
        self.question_id = question_id
        self.category = category
        self.tags = tags
        self.summary = summary
        self.solution_outline = solution_outline
        self.created_at = datetime.now()


# API Schemas
class QuestionSubmission(BaseModel):
    student_name: str
    course: str
    question_text: str
    code_snippet: Optional[str] = None
    preferred_ta_id: Optional[int] = None


class AnalyzerOutput(BaseModel):
    category: str
    estimated_difficulty: DifficultyLevel
    estimated_time_minutes: int
    tags: List[str]
    brief_summary: str


class MatcherOutput(BaseModel):
    recommended_ta_id: int
    alternative_tas: List[int]
    priority_score: float
    rationale: str


class SynthesizerOutput(BaseModel):
    similar_question_ids: List[int]
    similarity_explanation: str
    suggested_answer_outline: str
    student_friendly_hint: str


class QuestionResponse(BaseModel):
    queue_id: int
    assigned_ta_name: str
    estimated_wait_minutes: int
    category: str
    tags: List[str]
    brief_summary: str
    similar_questions: List[int]


class TAInfo(BaseModel):
    id: int
    name: str
    expertise_tags: List[str]
    current_queue_count: int


class QueueEntryResponse(BaseModel):
    queue_id: int
    student_name: str
    course: str
    question_text: str
    code_snippet: Optional[str]
    category: str
    tags: List[str]
    estimated_time_minutes: int
    assigned_ta_name: str
    status: QueueStatus
    brief_summary: str
    suggested_answer_outline: Optional[str] = None
    student_friendly_hint: Optional[str] = None
