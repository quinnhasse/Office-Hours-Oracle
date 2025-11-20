import { useState } from 'react'
import './App.css'
import StudentView from './components/StudentView'
import TADashboard from './components/TADashboard'
import Metrics from './components/Metrics'

const API_BASE = 'http://localhost:8000'

function App() {
  const [view, setView] = useState('student') // 'student' | 'ta' | 'metrics'

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎓 Office Hours Oracle</h1>
        <p className="subtitle">AI-Powered CS Office Hours Optimization</p>

        <nav className="view-switcher">
          <button
            className={view === 'student' ? 'active' : ''}
            onClick={() => setView('student')}
          >
            Student View
          </button>
          <button
            className={view === 'ta' ? 'active' : ''}
            onClick={() => setView('ta')}
          >
            TA Dashboard
          </button>
          <button
            className={view === 'metrics' ? 'active' : ''}
            onClick={() => setView('metrics')}
          >
            Metrics
          </button>
        </nav>
      </header>

      <main className="app-content">
        {view === 'student' && <StudentView apiBase={API_BASE} />}
        {view === 'ta' && <TADashboard apiBase={API_BASE} />}
        {view === 'metrics' && <Metrics apiBase={API_BASE} />}
      </main>

      <footer className="app-footer">
        <p>Powered by Claude Multi-Agent System (Analyzer → Matcher → Synthesizer)</p>
      </footer>
    </div>
  )
}

export default App
