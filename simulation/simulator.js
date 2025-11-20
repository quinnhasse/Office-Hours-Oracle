// Office Hours Chaos Simulator - UW Madison
// Claude AI Integration for behavioral simulation

class OfficeHoursSimulator {
    constructor() {
        this.students = [];
        this.studentIdCounter = 0;
        this.aiEnabled = false;
        this.simulationRunning = false;
        this.intervalId = null;
        this.taCapacity = 3; // Number of students TAs can help simultaneously
        this.avgWaitBeforeAI = 0;

        this.stats = {
            totalWaitTime: 0,
            studentsHelped: 0,
            studentsLeft: 0,
            studentsInQueue: 0,
            activeWithTA: 0
        };

        this.initializeUI();
    }

    initializeUI() {
        document.getElementById('autoDemo').addEventListener('click', () => this.runAutoDemo());
        document.getElementById('startChaos').addEventListener('click', () => this.startChaos());
        document.getElementById('activateAI').addEventListener('click', () => this.activateAI());
        document.getElementById('reset').addEventListener('click', () => this.reset());
    }

    async runAutoDemo() {
        this.logEvent('🎬 AUTO DEMO MODE - Sit back and watch!', 'success');
        document.getElementById('autoDemo').disabled = true;
        const demoStatus = document.getElementById('demoStatus');
        const demoStep = document.getElementById('demoStep');
        const demoTimer = document.getElementById('demoTimer');
        demoStatus.style.display = 'block';

        // Step 1: Start chaos
        demoStep.textContent = '1️⃣ Starting Chaos Simulation...';
        await this.startChaos();
        await this.waitWithCountdown(3, demoTimer, 's');

        // Step 2: Let chaos build up
        demoStep.textContent = '2️⃣ Building Up Chaos...';
        this.logEvent('📊 Letting chaos build up...', 'warning');
        await this.waitWithCountdown(10, demoTimer, 's');

        // Step 3: Activate AI
        demoStep.textContent = '3️⃣ Activating Claude AI...';
        this.logEvent('🚀 Auto-activating Claude AI...', 'success');
        await this.activateAI();
        await this.waitWithCountdown(5, demoTimer, 's');

        // Step 4: Let AI work
        demoStep.textContent = '4️⃣ AI Optimizing Queue...';
        await this.waitWithCountdown(10, demoTimer, 's');

        demoStep.textContent = '✅ Demo Complete!';
        demoTimer.textContent = '';
        this.logEvent('✅ AUTO DEMO COMPLETE - See the results!', 'success');

        await this.wait(3000);
        demoStatus.style.display = 'none';
        document.getElementById('autoDemo').disabled = false;
    }

    async waitWithCountdown(seconds, timerElement, unit = 's') {
        for (let i = seconds; i > 0; i--) {
            timerElement.textContent = `${i}${unit}`;
            await this.wait(1000);
        }
    }

    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async startChaos() {
        this.logEvent('🔥 MIDTERM WEEK CHAOS INITIATED', 'critical');
        this.simulationRunning = true;
        document.getElementById('startChaos').disabled = true;
        document.getElementById('activateAI').disabled = false;

        // Generate students with Claude
        await this.generateStudentsWithClaude();

        // Start simulation loop
        this.intervalId = setInterval(() => this.simulationTick(), 1000);

        // Add students gradually (chaos wave)
        this.addStudentWave();
    }

    async generateStudentsWithClaude() {
        this.logEvent('🧠 Claude generating student scenarios...', 'warning');

        const API_BASE = 'http://localhost:8000';

        try {
            const response = await fetch(`${API_BASE}/api/simulate/generate-students?count=30`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (data.students && data.students.length > 0) {
                this.studentQueue = data.students.map(s => ({
                    ...s,
                    id: this.studentIdCounter++,
                    arrivalTime: Date.now(),
                    waitTime: 0,
                    status: 'pending'
                }));

                this.logEvent(`✅ Claude generated ${data.students.length} student scenarios`, 'success');
            } else {
                throw new Error('No students returned from API');
            }
        } catch (error) {
            console.error('Claude API error:', error);
            this.logEvent('⚠️ Using fallback student generation', 'warning');
            this.generateFallbackStudents();
        }
    }

    generateFallbackStudents() {
        const courses = ['CS400', 'CS577'];
        const cs400Questions = [
            'BST deletion help needed',
            'Hash table collision resolution',
            'Recursion stack overflow issue',
            'Linked list reversal confused',
            'Red-Black tree balancing'
        ];
        const cs577Questions = [
            'Dynamic programming matrix chain',
            'Dijkstra shortest path stuck',
            'NP-completeness reduction proof',
            'Bellman-Ford negative cycles',
            'Greedy algorithm correctness proof'
        ];

        this.studentQueue = [];
        for (let i = 0; i < 30; i++) {
            const course = courses[Math.floor(Math.random() * courses.length)];
            const questions = course === 'CS400' ? cs400Questions : cs577Questions;

            this.studentQueue.push({
                id: this.studentIdCounter++,
                course: course,
                question: questions[Math.floor(Math.random() * questions.length)],
                complexity: Math.floor(Math.random() * 5) + 1,
                patience: Math.floor(Math.random() * 10) + 1,
                stressLevel: Math.floor(Math.random() * 5) + 6, // High stress during midterms!
                arrivalTime: Date.now(),
                waitTime: 0,
                status: 'pending'
            });
        }
    }

    addStudentWave() {
        let waveIndex = 0;
        const waveInterval = setInterval(() => {
            if (waveIndex < this.studentQueue.length) {
                const student = this.studentQueue[waveIndex];
                student.status = 'waiting';
                student.arrivalTime = Date.now();
                this.students.push(student);
                this.addStudentToZone(student, 'waitingZone');
                this.logEvent(`📚 ${student.course} student joined queue: "${student.question}"`, 'warning');
                waveIndex++;
            } else {
                clearInterval(waveInterval);
                this.logEvent('🌊 Student wave complete - queue at capacity!', 'critical');
            }
        }, 500); // Add student every 0.5 seconds
    }

    async simulationTick() {
        if (!this.simulationRunning) return;

        // Update wait times
        this.students.forEach(student => {
            if (student.status === 'waiting') {
                student.waitTime = (Date.now() - student.arrivalTime) / 1000 / 60; // minutes

                // Check if student gives up (patience check)
                if (!this.aiEnabled && student.waitTime > student.patience) {
                    this.studentLeavesQueue(student);
                }
            }
        });

        // Assign students to TAs
        const waitingStudents = this.students.filter(s => s.status === 'waiting');
        const activeStudents = this.students.filter(s => s.status === 'active');

        if (activeStudents.length < this.taCapacity && waitingStudents.length > 0) {
            const nextStudent = this.aiEnabled ?
                await this.selectNextStudentWithAI(waitingStudents) :
                waitingStudents[0];

            if (nextStudent) {
                this.assignStudentToTA(nextStudent);
            }
        }

        // Randomly complete some active sessions
        activeStudents.forEach(student => {
            if (Math.random() < 0.1) { // 10% chance per tick
                this.completeSession(student);
            }
        });

        this.updateMetrics();
    }

    async selectNextStudentWithAI(waitingStudents) {
        if (waitingStudents.length === 0) return null;

        const API_BASE = 'http://localhost:8000';

        // Use Claude to intelligently select next student
        const studentsInfo = waitingStudents.slice(0, 10).map(s => ({
            id: s.id,
            course: s.course,
            waitTime: Math.round(s.waitTime),
            complexity: s.complexity,
            patience: s.patience,
            question: s.question
        }));

        try {
            const response = await fetch(`${API_BASE}/api/simulate/select-next`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentsInfo)
            });

            const data = await response.json();
            const selectedId = data.selected_id;
            const selected = waitingStudents.find(s => s.id === selectedId);

            if (selected) {
                this.logAIDecision(`Selected student #${selectedId}: ${selected.course} - ${data.reason}`);
                return selected;
            }
        } catch (error) {
            console.error('AI selection error:', error);
        }

        // Fallback to FIFO
        return waitingStudents[0];
    }

    assignStudentToTA(student) {
        student.status = 'active';
        this.moveStudent(student, 'waitingZone', 'taZone');
        this.logEvent(`✅ ${student.course} student #${student.id} now with TA`, 'success');
    }

    completeSession(student) {
        student.status = 'helped';
        this.stats.studentsHelped++;
        this.stats.totalWaitTime += student.waitTime;
        this.moveStudent(student, 'taZone', 'doneZone');
        this.logEvent(`🎉 ${student.course} student #${student.id} helped successfully!`, 'success');
    }

    studentLeavesQueue(student) {
        student.status = 'left';
        this.stats.studentsLeft++;
        this.moveStudent(student, 'waitingZone', 'leftZone');
        this.logEvent(`💔 Student #${student.id} gave up after ${Math.round(student.waitTime)} min`, 'critical');
    }

    async activateAI() {
        // Record baseline stats
        const currentWait = this.calculateAverageWaitTime();
        this.avgWaitBeforeAI = currentWait;

        this.aiEnabled = true;
        document.getElementById('activateAI').disabled = true;
        document.getElementById('aiMode').textContent = 'ACTIVE 🟢';
        document.getElementById('aiMode').classList.add('active');

        this.logEvent('🧠 CLAUDE AI ACTIVATED - Optimizing queue...', 'success');
        this.logAIDecision('AI now intelligently routing students based on wait time, complexity, and patience');

        // Show success flash
        this.showSuccessFlash();

        // Increase TA capacity (AI optimization effect)
        setTimeout(() => {
            this.taCapacity = 5;
            this.logAIDecision('AI optimization: Increased effective TA capacity through better routing');
        }, 2000);

        // Show comparison after some time
        setTimeout(() => {
            this.showComparison();
        }, 5000);
    }

    showSuccessFlash() {
        const flash = document.createElement('div');
        flash.className = 'success-flash';
        flash.textContent = 'AI OPTIMIZING!';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 2000);
    }

    showComparison() {
        const box = document.getElementById('comparisonBox');
        const currentWait = this.calculateAverageWaitTime();
        const improvement = Math.round(((this.avgWaitBeforeAI - currentWait) / this.avgWaitBeforeAI) * 100);

        document.getElementById('beforeWait').textContent = Math.round(this.avgWaitBeforeAI);
        document.getElementById('afterWait').textContent = Math.round(currentWait);
        document.getElementById('improvement').textContent = improvement > 0 ? improvement : 0;

        box.style.display = 'block';
    }

    addStudentToZone(student, zoneId) {
        const zone = document.getElementById(zoneId);
        const dot = document.createElement('div');
        dot.className = `student-dot ${student.course.toLowerCase()}`;
        dot.id = `student-${student.id}`;
        dot.textContent = student.id;
        dot.title = `${student.course}: ${student.question}\nComplexity: ${student.complexity}/5\nPatience: ${student.patience}/10`;
        zone.appendChild(dot);
    }

    moveStudent(student, fromZone, toZone) {
        const dot = document.getElementById(`student-${student.id}`);
        if (dot) {
            document.getElementById(fromZone).removeChild(dot);
            document.getElementById(toZone).appendChild(dot);
        }
    }

    calculateAverageWaitTime() {
        const waiting = this.students.filter(s => s.status === 'waiting');
        if (waiting.length === 0) return 0;
        const total = waiting.reduce((sum, s) => sum + s.waitTime, 0);
        return total / waiting.length;
    }

    updateMetrics() {
        const avgWait = this.calculateAverageWaitTime();
        const queueSize = this.students.filter(s => s.status === 'waiting').length;
        const active = this.students.filter(s => s.status === 'active').length;
        const helped = this.students.filter(s => s.status === 'helped').length;
        const left = this.students.filter(s => s.status === 'left').length;

        document.getElementById('avgWaitTime').textContent = Math.round(avgWait);
        document.getElementById('queueSize').textContent = queueSize;
        document.getElementById('waitingCount').textContent = queueSize;
        document.getElementById('activeCount').textContent = active;
        document.getElementById('doneCount').textContent = helped;
        document.getElementById('leftCount').textContent = left;

        // TA stress based on queue size
        const taStress = Math.min(10, Math.round(queueSize / 3));
        document.getElementById('taStress').textContent = taStress;

        // Satisfaction
        const totalStudents = helped + left;
        const satisfaction = totalStudents > 0 ? Math.round((helped / totalStudents) * 100) : 100;
        document.getElementById('satisfaction').textContent = satisfaction;

        // Danger zone if wait time is critical
        if (avgWait > 30 && !this.aiEnabled) {
            if (!document.querySelector('.danger-zone')) {
                const danger = document.createElement('div');
                danger.className = 'danger-zone';
                document.body.appendChild(danger);
            }
        } else {
            const danger = document.querySelector('.danger-zone');
            if (danger) danger.remove();
        }

        // Make impatient students shake
        this.students.forEach(s => {
            if (s.status === 'waiting' && s.waitTime > s.patience * 0.7) {
                const dot = document.getElementById(`student-${s.id}`);
                if (dot) dot.classList.add('impatient');
            }
        });
    }

    logEvent(message, type = 'normal') {
        const log = document.getElementById('eventLog');
        const event = document.createElement('div');
        event.className = `event ${type}`;
        const time = new Date().toLocaleTimeString();
        event.textContent = `[${time}] ${message}`;
        log.insertBefore(event, log.firstChild);

        // Keep only last 20 events
        while (log.children.length > 20) {
            log.removeChild(log.lastChild);
        }
    }

    logAIDecision(message) {
        const decisionsDiv = document.getElementById('aiDecisions');
        const decision = document.createElement('div');
        decision.className = 'ai-decision';
        decision.textContent = `🧠 ${message}`;
        decisionsDiv.insertBefore(decision, decisionsDiv.firstChild);

        // Keep only last 10 decisions
        while (decisionsDiv.children.length > 10) {
            decisionsDiv.removeChild(decisionsDiv.lastChild);
        }
    }

    reset() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        this.students = [];
        this.studentQueue = [];
        this.studentIdCounter = 0;
        this.aiEnabled = false;
        this.simulationRunning = false;
        this.taCapacity = 3;
        this.avgWaitBeforeAI = 0;

        this.stats = {
            totalWaitTime: 0,
            studentsHelped: 0,
            studentsLeft: 0,
            studentsInQueue: 0,
            activeWithTA: 0
        };

        // Clear UI
        ['waitingZone', 'taZone', 'doneZone', 'leftZone'].forEach(zone => {
            document.getElementById(zone).innerHTML = '';
        });
        document.getElementById('eventLog').innerHTML = '';
        document.getElementById('aiDecisions').innerHTML = '';
        document.getElementById('comparisonBox').style.display = 'none';
        document.getElementById('aiMode').textContent = 'OFFLINE';
        document.getElementById('aiMode').classList.remove('active');

        // Reset buttons
        document.getElementById('startChaos').disabled = false;
        document.getElementById('activateAI').disabled = true;

        // Remove danger zone
        const danger = document.querySelector('.danger-zone');
        if (danger) danger.remove();

        this.updateMetrics();
        this.logEvent('System reset', 'normal');
    }
}

// Initialize simulator when page loads
let simulator;
window.addEventListener('DOMContentLoaded', () => {
    simulator = new OfficeHoursSimulator();
});
