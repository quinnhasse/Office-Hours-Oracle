# Office Hours Oracle - Chaos Simulation

## What This Is

An impressive visual simulation showing how Claude AI optimizes CS office hours during midterm week chaos. Perfect for wowing hackathon judges in 2 minutes!

## Quick Demo

### Option 1: Auto Demo (Easiest!)
1. Start backend: `cd backend && python main.py`
2. Start simulation: `cd simulation && ./start-demo.sh`
3. Click the purple **"🎬 AUTO DEMO (2 MIN)"** button
4. Watch the magic happen automatically!

### Option 2: Manual Demo (More Control)
1. Click **"START CHAOS SIMULATION"**
2. Watch students flood in (wait ~10 seconds)
3. Click **"🧠 ACTIVATE CLAUDE AI"**
4. See 70% improvement!

## What You'll See

### Before AI:
- 30+ students flooding office hours
- Wait times climbing to 47+ minutes
- Students giving up and leaving (💔 zone)
- TA stress at 10/10

### After AI:
- Claude intelligently routing students
- Wait times drop to ~12 minutes
- Students stop leaving
- 70% improvement in efficiency

## The Tech Stack

### Frontend (simulation/)
- `simulator.html` - Main demo page with split view
- `simulator.js` - Simulation engine with Claude API integration
- `chaos.css` - Animations and visual effects

### Backend (backend/main.py)
Three new simulation endpoints:
- `/api/simulate/generate-students` - Claude generates 30 realistic student scenarios
- `/api/simulate/select-next` - Claude optimally selects next student
- `/api/simulate/decide-action` - Claude predicts student behavior

### Claude Multi-Agent System
1. **Scenario Generator Agent**
   - Creates diverse, realistic student questions
   - Considers course type, complexity, patience, stress levels

2. **Queue Optimizer Agent**
   - Analyzes wait time, patience, complexity, course balance
   - Selects next student to maximize efficiency

3. **Behavior Predictor Agent**
   - Simulates student decision-making
   - Predicts when students will leave vs stay

## Key Features

### Visual Elements
- ✨ Animated student dots flowing through zones
- 🎨 Color coding: Red (CS400) vs Blue (CS577)
- ⚠️ Red danger zones when wait times critical
- ✅ Green success flash when AI activates
- 📊 Real-time metrics with big numbers
- 📝 Live event log showing all actions
- 🧠 **AI Decisions panel** showing Claude's reasoning (unique!)

### Interactive Controls
- 🎬 Auto Demo - Runs full demo automatically (28 seconds)
- 🔥 Start Chaos - Begin simulation manually
- 🧠 Activate AI - Turn on Claude optimization
- 🔄 Reset - Start over

### Metrics Displayed
- Current Wait Time (minutes)
- Students in Queue
- TA Stress Level (1-10)
- Student Satisfaction (%)
- AI Impact Comparison (before/after)

## Demo Script (2 Minutes)

### Setup (10 seconds)
"We built Office Hours Oracle - a multi-agent Claude system that optimizes CS office hours. Watch this simulation of midterm week."

### Chaos (15 seconds)
*Click START CHAOS or AUTO DEMO*
"30 students flood in. Wait times climb. Students start giving up. TAs are overwhelmed."

### AI Solution (30 seconds)
*Click ACTIVATE AI (if manual) or watch auto demo*
"Claude analyzes each student: their wait time, patience level, question complexity. Makes intelligent routing decisions in real-time."

### Results (30 seconds)
*Point to comparison box*
"Before AI: 47-minute waits. With AI: 12-minute waits. That's 70% improvement. Students stop leaving. Same system powers our real Office Hours Oracle."

### Tech Deep-Dive (45 seconds, optional)
"Three specialized Claude agents:
1. **Generator** created these 30 realistic scenarios
2. **Optimizer** selects next student based on multiple factors
3. **Predictor** simulates student behavior

See the AI Decisions panel? That's Claude's reasoning in real-time. Multi-agent architecture with transparent decision-making."

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│         simulation/simulator.html           │
│  ┌──────────────┐      ┌─────────────────┐ │
│  │ Visualization│      │  Metrics View   │ │
│  │              │      │                 │ │
│  │ Student Dots │      │ • Wait Time     │ │
│  │ Queue Zones  │      │ • TA Stress     │ │
│  │ Animations   │      │ • AI Decisions  │ │
│  └──────────────┘      └─────────────────┘ │
└─────────────────────────────────────────────┘
                    ↕ HTTP/Fetch
┌─────────────────────────────────────────────┐
│     backend/main.py (FastAPI)               │
│  ┌─────────────────────────────────────┐   │
│  │  Simulation Endpoints               │   │
│  │  • /simulate/generate-students      │   │
│  │  • /simulate/select-next            │   │
│  │  • /simulate/decide-action          │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↕ Anthropic SDK
┌─────────────────────────────────────────────┐
│         Claude 3.5 Sonnet                   │
│  ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │Generator │ │Optimizer │ │Predictor   │ │
│  │  Agent   │ │  Agent   │ │  Agent     │ │
│  └──────────┘ └──────────┘ └────────────┘ │
└─────────────────────────────────────────────┘
```

## Files Created

```
simulation/
├── README.md              ← This file
├── simulator.html         ← Main demo page (split view UI)
├── simulator.js          ← Simulation engine + Claude API calls
├── chaos.css             ← Animations, colors, visual effects
└── start-demo.sh         ← Quick launcher script

../backend/main.py         ← Added simulation endpoints (lines 282-421)
../SIMULATION_DEMO.md      ← Detailed demo guide
../DEMO_QUICKSTART.md      ← Quick reference card
```

## Troubleshooting

### Backend not responding?
```bash
cd backend
python main.py
# Should see: "Uvicorn running on http://0.0.0.0:8000"
```

### Students not appearing?
- Check backend is running on port 8000
- Fallback mode activates automatically if API fails
- Check browser console for errors

### Want to demo offline?
- Fallback mode works without backend
- Uses pre-generated student scenarios
- Simple rule-based queue logic (no Claude)

### CORS errors?
- Backend allows localhost:5173, localhost:3000, and file://
- If using different port, update CORS in backend/main.py line 26

## Performance Notes

- Simulation tick: 1 second
- Student wave: 0.5 seconds per student
- Auto demo runtime: ~28 seconds total
- Claude API calls: ~2-3 seconds each
- Graceful fallbacks if API slow

## Customization

### Change student count:
Edit `simulator.js` line 53:
```javascript
const response = await fetch(`${API_BASE}/api/simulate/generate-students?count=50`
```

### Adjust simulation speed:
Edit `simulator.js` line 42:
```javascript
this.intervalId = setInterval(() => this.simulationTick(), 500); // 0.5 sec ticks
```

### Modify TA capacity:
Edit `simulator.js` line 11:
```javascript
this.taCapacity = 5; // Number of simultaneous students
```

## Why This Demo Works

1. **Immediate Visual Impact** - Action starts instantly
2. **Clear Problem/Solution** - Before/after is obvious
3. **Quantifiable Results** - 70% shows real impact
4. **AI Transparency** - See Claude's reasoning
5. **Perfect Timing** - 2 minutes fits any format
6. **Fail-Safe** - Fallback mode if API issues
7. **Interactive** - Judges can click buttons

## Production Considerations

This is a hackathon demo optimized for visual impact. For production:
- Add WebSocket for real-time updates
- Implement proper error handling
- Add rate limiting on API endpoints
- Store simulation history
- Add authentication
- Optimize Claude API calls (batch processing)
- Add proper TypeScript types
- Comprehensive testing

## Credits

Built for UW-Madison Hackathon 2024
- Multi-agent Claude architecture
- Real-time simulation engine
- Visual chaos demonstration

**Now go win that hackathon! 🏆**
