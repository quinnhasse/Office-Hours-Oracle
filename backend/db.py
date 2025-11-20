"""
In-memory database for Office Hours Oracle
Simple storage for hackathon demo
"""
from typing import List, Optional
from models import TA, Question, QueueEntry, KBEntry, QueueStatus


class Database:
    def __init__(self):
        self.tas: List[TA] = []
        self.questions: List[Question] = []
        self.queue: List[QueueEntry] = []
        self.kb_entries: List[KBEntry] = []

        self._ta_counter = 0
        self._question_counter = 0
        self._queue_counter = 0
        self._kb_counter = 0

        self._seed_data()

    def _seed_data(self):
        """Seed initial TAs and sample KB entries"""
        # Create TAs
        self.add_ta("Alice Chen", ["Data Structures", "Trees", "Red-Black Trees", "AVL Trees"])
        self.add_ta("Bob Smith", ["Systems", "C Programming", "Pointers", "Memory Management"])
        self.add_ta("Charlie Davis", ["Algorithms", "Dynamic Programming", "Graph Algorithms"])
        self.add_ta("Diana Wu", ["Debugging", "Testing", "Python", "General CS"])

        # Seed some KB entries for similarity matching
        q1 = self.add_question("Past Student", "CS 400",
                               "How do I fix rotations in red-black tree deletion?", None)
        kb1 = self.add_kb_entry(q1.id, "Red-Black Tree Deletion",
                               ["trees", "red-black", "deletion", "rotations"],
                               "Student struggling with case 3 of RB tree deletion fixup",
                               "1. Identify the case (sibling color, nephew colors)\n2. Apply rotation\n3. Recolor nodes\n4. Recurse if needed")

        q2 = self.add_question("Past Student", "CS 354",
                              "Segfault when dereferencing pointer in malloc'd struct", "char *ptr = malloc(sizeof(MyStruct));")
        kb2 = self.add_kb_entry(q2.id, "Memory Allocation Error",
                               ["c", "pointers", "malloc", "segfault"],
                               "Incorrect pointer arithmetic after malloc",
                               "1. Check malloc return value\n2. Verify sizeof() usage\n3. Check pointer arithmetic\n4. Use valgrind to detect issues")

    # TA operations
    def add_ta(self, name: str, expertise_tags: List[str]) -> TA:
        self._ta_counter += 1
        ta = TA(self._ta_counter, name, expertise_tags)
        self.tas.append(ta)
        return ta

    def get_ta(self, ta_id: int) -> Optional[TA]:
        return next((ta for ta in self.tas if ta.id == ta_id), None)

    def get_all_tas(self) -> List[TA]:
        return [ta for ta in self.tas if ta.is_active]

    def get_ta_queue_count(self, ta_id: int) -> int:
        return sum(1 for entry in self.queue
                  if entry.assigned_ta_id == ta_id and entry.status != QueueStatus.DONE)

    # Question operations
    def add_question(self, student_name: str, course: str, text: str,
                    code: Optional[str] = None, preferred_ta_id: Optional[int] = None) -> Question:
        self._question_counter += 1
        question = Question(self._question_counter, student_name, course, text, code, preferred_ta_id)
        self.questions.append(question)
        return question

    def get_question(self, question_id: int) -> Optional[Question]:
        return next((q for q in self.questions if q.id == question_id), None)

    # Queue operations
    def add_to_queue(self, question_id: int, assigned_ta_id: int,
                    estimated_time_minutes: int) -> QueueEntry:
        self._queue_counter += 1
        entry = QueueEntry(self._queue_counter, question_id, assigned_ta_id, estimated_time_minutes)
        self.queue.append(entry)
        return entry

    def get_queue_entry(self, queue_id: int) -> Optional[QueueEntry]:
        return next((entry for entry in self.queue if entry.id == queue_id), None)

    def get_active_queue(self) -> List[QueueEntry]:
        return [entry for entry in self.queue if entry.status != QueueStatus.DONE]

    def update_queue_status(self, queue_id: int, status: QueueStatus) -> Optional[QueueEntry]:
        entry = self.get_queue_entry(queue_id)
        if entry:
            entry.status = status
        return entry

    # KB operations
    def add_kb_entry(self, question_id: int, category: str, tags: List[str],
                    summary: str, solution_outline: str) -> KBEntry:
        self._kb_counter += 1
        entry = KBEntry(self._kb_counter, question_id, category, tags, summary, solution_outline)
        self.kb_entries.append(entry)
        return entry

    def search_kb(self, tags: List[str], category: str = None) -> List[KBEntry]:
        """Simple tag-based search for similar questions"""
        results = []
        for entry in self.kb_entries:
            # Check tag overlap
            common_tags = set(entry.tags) & set(tags)
            if common_tags or (category and category.lower() in entry.category.lower()):
                results.append(entry)
        return results[:5]  # Return top 5


# Global database instance
db = Database()
