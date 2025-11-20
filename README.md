# Office Hours Oracle

AI-powered CS office hours optimization using Claude's multi-agent system.

## Overview

**Office Hours Oracle** reduces wait times and improves student outcomes by:
- **Analyzing** student questions before they arrive (category, difficulty, estimated time)
- **Matching** them to the best TA based on expertise and current queue length
- **Synthesizing** solution guidance from a growing knowledge base of past questions

### Multi-Agent Claude Architecture

1. **Analyzer Agent**: Extracts metadata from student questions (category, tags, difficulty, time estimate)
2. **Matcher Agent**: Assigns to optimal TA using expertise overlap + queue balancing
3. **Synthesizer Agent**: Finds similar past questions and generates teaching guidance for TAs

## Tech Stack

- **Backend**: FastAPI + Python + WebSockets
- **Frontend**: React (Vite) + WebSocket client
- **AI**: Anthropic Claude API (3 specialized agents)
- **Database**: In-memory (SQLite-style for demo)

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Anthropic API key

### Installation

1. **Clone and setup**
```bash
git clone <repo>
cd claude-hackathon-starter
```

2. **Backend setup**
```bash
cd backend
pip install -r requirements.txt
```

3. **Configure environment**

Create `backend/.env`:
```
ANTHROPIC_API_KEY=your_key_here
USE_MOCK_CLAUDE=false
```

For demo without API key, set `USE_MOCK_CLAUDE=true`.

4. **Frontend setup**
```bash
cd frontend
npm install
```

### Running

**Terminal 1 - Backend:**
```bash
cd backend
python main.py
# Or: uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend runs at `http://localhost:5173`

## Demo Script (3 minutes)

### Setup
1. Open `http://localhost:5173`
2. Have both Student View and TA Dashboard tabs ready

### Demo Flow

**Step 1: Student Submits Question (30 sec)**
- Switch to Student View
- Fill in form:
  - Name: "Alex Smith"
  - Course: "CS 400"
  - Question: "I'm getting infinite recursion in my red-black tree delete fixup. The parent pointer seems correct but the rotation isn't balancing properly."
  - Code snippet: (paste sample RB tree code)
- Click Submit
- **Show**: Analyzer output (category, tags, estimated 15 min)
- **Show**: Matched to "Alice Chen - Trees"
- **Show**: Similar past questions found

**Step 2: TA Dashboard Real-Time Update (30 sec)**
- Switch to TA Dashboard tab
- **Show**: Question appeared in queue immediately (WebSocket)
- **Show**: Click on question to see details

**Step 3: AI-Generated Guidance (60 sec)**
- **Show AI Analysis section**:
  - Category: "Red-Black Tree Deletion"
  - Tags automatically extracted
  - Estimated time: 15 minutes
- **Show Student Hint**: "Think about the base case and how the structure maintains its invariants"
- **Show Suggested Teaching Approach** (from Synthesizer):
  ```
  1. Identify the deletion case (sibling color, nephew colors)
  2. Walk through the rotation step-by-step
  3. Verify recoloring maintains RB properties
  4. Check parent pointer updates after rotation
  ```
- **Explain**: This came from analyzing similar past questions in KB

**Step 4: Resolution & Knowledge Growth (30 sec)**
- Click "Mark as Resolved"
- Switch to Metrics tab
- **Show**:
  - Time saved metric (5 min per question vs random assignment)
  - Knowledge base growing (now 3 entries)
  - Resolution rate

**Step 5: System Architecture (30 sec)**
- Scroll down on Metrics page
- **Show** the 3-agent flow visualization
- **Explain**:
  - "When Alex submitted, Agent 1 analyzed the question"
  - "Agent 2 matched to Alice based on 'Trees' expertise + her queue was shortest"
  - "Agent 3 found similar RB tree questions and generated the teaching outline"
  - "All in ~2 seconds, before the student even finished reading the confirmation"

### Key Talking Points

- **Not just Q&A**: Claude isn't answering questions - it's coordinating 3 specialized agents to optimize a workflow
- **Real measurable impact**: Reduced wait times through smart matching
- **Knowledge compounds**: Each resolved question makes the system smarter
- **TA empowerment**: Guides teaching approach, doesn't replace human expertise
- **Real-time**: WebSocket updates show queue changes instantly

## Architecture Highlights

### Backend (backend/main.py)

```python
# Multi-agent workflow on question submit:
analyzer_output = analyze_question(...)      # Agent 1
matcher_output = match_ta(analyzer_output...) # Agent 2
synthesizer_output = synthesize_solution(...) # Agent 3
# -> Smart queue assignment + WebSocket broadcast
```

### Claude Client (backend/claude_client.py)

Each agent has:
- Dedicated system prompt with clear JSON schema
- Specific role (Analyzer, Matcher, Synthesizer)
- Fallback mock for demo reliability
- Console logging to show agent coordination

### Frontend (frontend/src/)

- **StudentView.jsx**: Question submission + response display
- **TADashboard.jsx**: Real-time queue with WebSocket + question details
- **Metrics.jsx**: System performance + 3-agent flow visualization
- **useWebSocket.js**: Simple hook for real-time updates

## Project Structure

```
backend/
├── main.py              # FastAPI app + endpoints + WebSocket
├── models.py            # Data models + Pydantic schemas
├── db.py                # In-memory database
├── claude_client.py     # 3-agent Claude system
└── requirements.txt

frontend/
├── src/
│   ├── App.jsx                    # Main app + view routing
│   ├── App.css                    # All styles
│   ├── components/
│   │   ├── StudentView.jsx       # Question submission
│   │   ├── TADashboard.jsx       # Queue + WebSocket
│   │   └── Metrics.jsx           # Performance dashboard
│   └── hooks/
│       └── useWebSocket.js       # WebSocket connection
└── package.json
```

## API Endpoints

### REST

- `GET /api/tas` - List all TAs with queue counts
- `POST /api/questions` - Submit question (triggers 3-agent workflow)
- `GET /api/queue` - Current queue state
- `POST /api/queue/{id}/resolve` - Mark as resolved + add to KB
- `GET /api/metrics` - System metrics

### WebSocket

- `ws://localhost:8000/ws/queue` - Real-time queue updates

## Environment Variables

**Backend (.env)**
```
ANTHROPIC_API_KEY=sk-...
USE_MOCK_CLAUDE=false  # true for demo without API calls
```

**Frontend**

API_BASE hardcoded in `App.jsx` as `http://localhost:8000`

## Demo Tips

1. **Pre-seed data**: Backend auto-seeds 4 TAs + 2 KB entries on startup
2. **Mock mode**: Set `USE_MOCK_CLAUDE=true` if API is flaky during demo
3. **Multiple questions**: Submit 2-3 questions to show queue balancing
4. **WebSocket demo**: Have TA Dashboard open while submitting from Student View
5. **Code readability**: All agent calls logged to backend console with clear labels

## Future Enhancements

- Persistent database (PostgreSQL + SQLAlchemy)
- Student queue position notifications
- TA availability scheduling
- Automatic question categorization training
- Analytics dashboard for professors
- Mobile app for on-the-go submissions

## License

MIT

## Credits

Built for hackathon by Quinn Hasse

Powered by Anthropic Claude (Sonnet 3.5)
