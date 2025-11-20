# Office Hours Oracle

### AI-Powered CS Office Hours Optimization

[![Python](https://img.shields.io/badge/Python-3.8+-3776ab?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![Claude](https://img.shields.io/badge/Claude-3.5-7c3aed?logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-4a90e2)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)

<p align="center">
  <img src="Office Hours Oracle.png" width="60%" alt="Office Hours Oracle Banner">
</p>

## Overview

**Office Hours Oracle** transforms chaotic CS office hours into an optimized, intelligent queue system. By deploying three specialized Claude agents, we reduce student wait times by 70% while empowering TAs with context-aware teaching guidance.

### How It Works

The system analyzes student questions before they arrive, matches them to the optimal TA, and synthesizes solution guidance from a growing knowledge base—all in real-time through:

1. **Analyzer Agent**: Extracts metadata (category, tags, difficulty, estimated time)
2. **Matcher Agent**: Assigns to optimal TA using expertise overlap + queue balancing
3. **Synthesizer Agent**: Finds similar past questions and generates teaching guidance

### Key Features

**Multi-Agent Architecture**
- Three specialized Claude agents working in concert
- Real-time decision-making with transparent reasoning
- Knowledge base that learns from every resolved question

**Smart Queue Management**
- AI-optimized TA matching based on expertise and availability
- Automatic difficulty assessment and time estimation
- Dynamic queue rebalancing during peak hours

**TA Empowerment**
- Context-aware teaching suggestions from past solutions
- Student hints that guide without giving answers away
- Real-time queue updates via WebSocket

## Tech Stack

**Backend**: FastAPI, Python, WebSockets, Anthropic Claude API
**Frontend**: React (Vite), WebSocket client
**AI**: Claude 3.5 Sonnet (multi-agent orchestration)
**Database**: In-memory SQLite-style (demo)

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Anthropic API key

### Installation

**1. Clone and setup**
```bash
git clone <repo>
cd claude-hackathon-starter
```

**2. Backend setup**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**3. Configure environment**

Create `backend/.env`:
```env
ANTHROPIC_API_KEY=your_key_here
USE_MOCK_CLAUDE=false
```

For demo without API key, set `USE_MOCK_CLAUDE=true`.

**4. Frontend setup**
```bash
cd frontend
npm install
```

### Running

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```
Backend runs at `http://localhost:8000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173`

### Chaos Simulation Demo

Experience the system under pressure with our midterm week chaos simulator:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Terminal 2 - Simulation:**
```bash
cd simulation
./start-demo.sh
```

**Auto Demo**: Click the purple "🎬 AUTO DEMO (2 MIN)" button for a hands-free demonstration showing 70% improvement in wait times.

See [DEMO_QUICKSTART.md](DEMO_QUICKSTART.md) for detailed instructions.

## Architecture

### Multi-Agent Workflow

```python
# When a student submits a question:
analyzer_output = analyze_question(...)      # Agent 1: Extract metadata
matcher_output = match_ta(analyzer_output...)# Agent 2: Optimal TA assignment
synthesizer_output = synthesize_solution(...) # Agent 3: Teaching guidance
# → Smart queue placement + WebSocket broadcast
```

### System Flow

```
Student Question → Analyzer Agent → Matcher Agent → Synthesizer Agent
                      ↓                 ↓               ↓
                   Metadata         Best TA        Teaching Guide
                      ↓                 ↓               ↓
                      └─────────────────┴───────────────┘
                                       ↓
                            Queue + WebSocket Update
```

## Project Structure

```
backend/
├── main.py              # FastAPI app + endpoints + WebSocket
├── models.py            # Pydantic data models
├── db.py                # In-memory database
├── claude_client.py     # 3-agent Claude orchestration
└── requirements.txt

frontend/
├── src/
│   ├── App.jsx                  # Main app + routing
│   ├── components/
│   │   ├── StudentView.jsx     # Question submission
│   │   ├── TADashboard.jsx     # Real-time queue
│   │   └── Metrics.jsx         # Performance dashboard
│   └── hooks/
│       └── useWebSocket.js     # WebSocket connection
└── package.json

simulation/
├── simulator.html           # Chaos simulation demo
├── simulator.js            # Multi-agent simulation engine
├── chaos.css              # Visual effects & animations
└── start-demo.sh          # Quick launcher
```

## API Endpoints

### REST

- `GET /api/tas` - List all TAs with queue counts
- `POST /api/questions` - Submit question (triggers 3-agent workflow)
- `GET /api/queue` - Current queue state
- `POST /api/queue/{id}/resolve` - Mark as resolved + add to KB
- `GET /api/metrics` - System performance metrics

### Simulation (Demo)

- `POST /api/simulate/generate-students` - Claude generates realistic student scenarios
- `POST /api/simulate/select-next` - AI-optimized queue selection
- `POST /api/simulate/decide-action` - Behavioral prediction

### WebSocket

- `ws://localhost:8000/ws/queue` - Real-time queue updates

## Demo Script

### Main Application (3 minutes)

**Step 1: Student Submission (30s)**
- Navigate to Student View
- Submit a complex question (e.g., "Red-black tree deletion infinite recursion")
- Show Analyzer output: category, tags, estimated 15 min
- Show TA match: "Alice Chen - Trees" with rationale

**Step 2: TA Dashboard Real-Time (30s)**
- Switch to TA Dashboard tab
- Observe question appear instantly via WebSocket
- Click to view AI-generated teaching guidance

**Step 3: AI Analysis Deep-Dive (60s)**
- Show categorization and metadata extraction
- Display student hint (guides without revealing answer)
- Present suggested teaching approach from Synthesizer
- Explain knowledge base learning

**Step 4: Resolution & Growth (30s)**
- Mark question as resolved
- View metrics: time saved, KB growth, resolution rate

**Step 5: Architecture Walkthrough (30s)**
- Explain 3-agent coordination
- Show console logs demonstrating agent workflow
- Emphasize ~2s response time

### Chaos Simulation (2 minutes)

See [SIMULATION_DEMO.md](SIMULATION_DEMO.md) for complete demo script showing 70% wait time reduction.

## Key Talking Points

- **Not just Q&A**: Three specialized agents coordinate to optimize workflow, not answer questions
- **Measurable Impact**: 70% reduction in wait times through intelligent matching
- **Knowledge Compounds**: Every resolved question strengthens the system
- **TA Empowerment**: Guides teaching approach without replacing human expertise
- **Real-Time**: WebSocket ensures zero-latency queue updates

## Environment Variables

**Backend (.env)**
```env
ANTHROPIC_API_KEY=sk-...
USE_MOCK_CLAUDE=false  # Set true for demo without API calls
```

**Frontend**

API_BASE configured in `App.jsx` as `http://localhost:8000`

## Future Enhancements

- Persistent database (PostgreSQL + SQLAlchemy)
- Student queue position notifications
- TA availability scheduling
- Automatic categorization training
- Analytics dashboard for professors
- Mobile app for on-the-go submissions

## Technologies

**Backend**: FastAPI, Pydantic, Anthropic SDK, WebSockets, AsyncIO
**Frontend**: React 18, Vite, WebSocket API
**AI**: Claude 3.5 Sonnet (multi-agent orchestration)
**Simulation**: Vanilla JS, CSS animations, real-time metrics

## Demo Tips

1. **Pre-seeded data**: Backend auto-seeds 4 TAs + 2 KB entries on startup
2. **Mock mode**: Set `USE_MOCK_CLAUDE=true` if API is unreliable during demo
3. **Multiple questions**: Submit 2-3 questions to demonstrate queue balancing
4. **WebSocket showcase**: Keep TA Dashboard open while submitting from Student View
5. **Console visibility**: All agent calls logged with clear labels for transparency

## License

MIT

## Credits

Built for UW-Madison ClaudeHacks 2024 by Quinn Hasse

Powered by Anthropic Claude 3.5 Sonnet

---

<p align="center">
  <img src="https://img.shields.io/badge/🏆_5th_Place-UW_ClaudeHacks_2024-ffd700?style=for-the-badge" alt="5th Place - UW ClaudeHacks 2024">
</p>

<p align="center">
  <strong>🎉 Finalist at UW-Madison ClaudeHacks 2024 🎉</strong>
</p>

<p align="center">
  Recognized for innovative multi-agent AI architecture and measurable impact on student experience.<br>
  Competed against teams from across the University of Wisconsin-Madison.
</p>
