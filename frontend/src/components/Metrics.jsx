import { useState, useEffect } from 'react'

export default function Metrics({ apiBase }) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = () => {
      fetch(`${apiBase}/api/metrics`)
        .then(res => res.json())
        .then(data => {
          setMetrics(data)
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to fetch metrics:', err)
          setLoading(false)
        })
    }

    fetchMetrics()
    // Refresh every 5 seconds
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [apiBase])

  if (loading) {
    return <div className="metrics-view"><p>Loading metrics...</p></div>
  }

  if (!metrics) {
    return <div className="metrics-view"><p>Failed to load metrics</p></div>
  }

  return (
    <div className="metrics-view">
      <h2>System Metrics</h2>
      <p className="metrics-subtitle">Real-time performance of the AI-powered office hours system</p>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-value">{metrics.total_questions}</div>
          <div className="metric-label">Total Questions</div>
          <div className="metric-description">Questions submitted through the system</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{metrics.active_queue_count}</div>
          <div className="metric-label">Active Queue</div>
          <div className="metric-description">Students currently waiting for help</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{metrics.resolved_count}</div>
          <div className="metric-label">Resolved</div>
          <div className="metric-description">Questions successfully answered</div>
        </div>

        <div className="metric-card highlight">
          <div className="metric-value">{metrics.estimated_time_saved_minutes} min</div>
          <div className="metric-label">Time Saved</div>
          <div className="metric-description">Est. vs. random TA assignment</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">{metrics.knowledge_base_size}</div>
          <div className="metric-label">Knowledge Base</div>
          <div className="metric-description">Resolved questions for similarity matching</div>
        </div>

        <div className="metric-card">
          <div className="metric-value">
            {metrics.resolved_count > 0
              ? Math.round((metrics.resolved_count / metrics.total_questions) * 100)
              : 0}%
          </div>
          <div className="metric-label">Resolution Rate</div>
          <div className="metric-description">Questions successfully resolved</div>
        </div>
      </div>

      <div className="metrics-info">
        <h3>How It Works</h3>
        <div className="agent-flow">
          <div className="agent-step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Analyzer Agent</h4>
              <p>Extracts category, difficulty, time estimate, and tags from student questions</p>
            </div>
          </div>

          <div className="agent-arrow">→</div>

          <div className="agent-step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Matcher Agent</h4>
              <p>Assigns questions to the best TA based on expertise overlap and queue length</p>
            </div>
          </div>

          <div className="agent-arrow">→</div>

          <div className="agent-step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Synthesizer Agent</h4>
              <p>Finds similar past questions and generates teaching guidance for TAs</p>
            </div>
          </div>
        </div>

        <div className="impact-section">
          <h4>Impact</h4>
          <ul>
            <li>
              <strong>Reduced Wait Times:</strong> Smart TA matching balances expertise and queue length
            </li>
            <li>
              <strong>Better Outcomes:</strong> TAs get AI-generated teaching guidance from similar past questions
            </li>
            <li>
              <strong>Knowledge Capture:</strong> Each resolved question enriches the knowledge base
            </li>
            <li>
              <strong>Student Experience:</strong> Students get hints while waiting and see transparent estimates
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
