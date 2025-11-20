# 🚀 CHAOS SIMULATION - 2 MINUTE SETUP

## Terminal 1: Backend
```bash
cd backend
python main.py
```
✅ Should show: "Uvicorn running on http://0.0.0.0:8000"

## Terminal 2: Simulation
```bash
cd simulation
./start-demo.sh
```
✅ Browser should auto-open to http://localhost:8080/simulator.html

---

## The 2-Minute Demo

### 1️⃣ START CHAOS (10 sec)
**Click:** "START CHAOS SIMULATION"
**Say:** "Let's simulate midterm week - 30 students flooding office hours"
**Watch:** Colored dots appear, wait times climbing

### 2️⃣ SHOW THE PROBLEM (20 sec)
**Point to metrics:**
- Wait Time: 30+ min 📈
- TA Stress: 10/10 🔥
- Students giving up 💔

**Say:** "Without AI, students wait too long and leave frustrated"

### 3️⃣ ACTIVATE AI (30 sec)
**Click:** "ACTIVATE CLAUDE AI"
**Watch:** Green flash, AI decisions appear
**Point to:**
- AI reasoning panel (shows Claude's decisions)
- Wait time dropping
- Students stop leaving

**Say:** "Claude analyzes each student's wait time, patience, and question complexity to optimize the queue in real-time"

### 4️⃣ SHOW RESULTS (20 sec)
**Point to comparison box:**
```
Before: 47 min → With AI: 12 min
Improvement: 70%
```

**Say:** "70% reduction in wait times. Same concept powers our real Office Hours Oracle."

### 5️⃣ TECHNICAL DETAILS (optional, 30 sec)
"Three Claude agents:
1. **Generator** - Creates realistic student scenarios
2. **Optimizer** - Selects next student intelligently
3. **Predictor** - Predicts student behavior

Multi-agent architecture with real-time decision-making."

---

## Key Visuals to Point Out
✨ **Animated dots** moving through zones
✨ **Color coding** - Red (CS400) vs Blue (CS577)
✨ **AI Decisions panel** - Shows Claude's reasoning (UNIQUE!)
✨ **Big numbers** - 70% improvement
✨ **Real-time event log** - Shows what's happening

---

## If Something Breaks
- **Backend not running?** Check Terminal 1
- **CORS errors?** Make sure backend is on port 8000
- **No students?** Fallback mode activates automatically
- **Need to restart?** Click RESET button

---

## Files Created
```
simulation/
├── simulator.html     ← Main demo page
├── simulator.js       ← Simulation engine + Claude API
├── chaos.css         ← Animations & styling
└── start-demo.sh     ← Quick launcher

backend/main.py        ← Added 3 new simulation endpoints
```

---

## Pro Tips
🎯 Practice the 2-minute version once before demo
🎯 Have backend running BEFORE judges arrive
🎯 Keep browser window at 1920x1080 for best visuals
🎯 If live demo fails, you have fallback mode!
🎯 Emphasize the AI decision panel - that's your differentiator

---

**YOU'RE READY! GO WIN THIS! 🏆**
