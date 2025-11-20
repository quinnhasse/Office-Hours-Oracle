import { useState, useEffect } from 'react'
import useWebSocket from '../hooks/useWebSocket'

export default function TADashboard({ apiBase }) {
  const [queue, setQueue] = useState([])
  const [selectedQuestion, setSelectedQuestion] = useState(null)
  const [resolving, setResolving] = useState(null)

  // WebSocket connection for real-time updates
  const wsUrl = apiBase.replace('http', 'ws') + '/ws/queue'
  const { message } = useWebSocket(wsUrl)

  // Update queue when WebSocket message received
  useEffect(() => {
    if (message && message.type === 'queue_update') {
      setQueue(message.queue)
    }
  }, [message])

  // Fetch initial queue
  useEffect(() => {
    fetch(`${apiBase}/api/queue`)
      .then(res => res.json())
      .then(data => setQueue(data))
      .catch(err => console.error('Failed to fetch queue:', err))
  }, [apiBase])

  const handleResolve = async (queueId) => {
    setResolving(queueId)
    try {
      const res = await fetch(`${apiBase}/api/queue/${queueId}/resolve`, {
        method: 'POST'
      })

      if (!res.ok) throw new Error('Failed to resolve question')

      // Clear selection if this was the selected question
      if (selectedQuestion?.queue_id === queueId) {
        setSelectedQuestion(null)
      }

    } catch (err) {
      console.error('Error resolving question:', err)
    } finally {
      setResolving(null)
    }
  }

  const getDifficultyColor = (time) => {
    if (time <= 10) return '#4ade80'
    if (time <= 20) return '#fbbf24'
    return '#f87171'
  }

  const getStatusBadge = (status) => {
    const badges = {
      'QUEUED': { text: 'Queued', color: '#3b82f6' },
      'IN_PROGRESS': { text: 'In Progress', color: '#f59e0b' },
      'DONE': { text: 'Done', color: '#10b981' }
    }
    const badge = badges[status] || badges['QUEUED']
    return (
      <span className="status-badge" style={{ backgroundColor: badge.color }}>
        {badge.text}
      </span>
    )
  }

  return (
    <div className="ta-dashboard">
      <div className="dashboard-header">
        <h2>TA Dashboard</h2>
        <div className="queue-stats">
          <span className="stat">
            <strong>{queue.length}</strong> in queue
          </span>
          <span className="ws-indicator" style={{ color: message ? '#10b981' : '#6b7280' }}>
            ● {message ? 'Live' : 'Connecting...'}
          </span>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Queue List */}
        <div className="queue-list">
          <h3>Active Queue</h3>

          {queue.length === 0 ? (
            <div className="empty-state">
              <p>No students in queue</p>
              <p className="muted">Questions will appear here in real-time</p>
            </div>
          ) : (
            <div className="queue-items">
              {queue.map(item => (
                <div
                  key={item.queue_id}
                  className={`queue-item ${selectedQuestion?.queue_id === item.queue_id ? 'selected' : ''}`}
                  onClick={() => setSelectedQuestion(item)}
                >
                  <div className="queue-item-header">
                    <div>
                      <strong>{item.student_name}</strong>
                      <span className="course-badge">{item.course}</span>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>

                  <div className="queue-item-category">{item.category}</div>

                  <div className="queue-item-footer">
                    <span>📍 {item.assigned_ta_name}</span>
                    <span
                      className="time-estimate"
                      style={{ color: getDifficultyColor(item.estimated_time_minutes) }}
                    >
                      ~{item.estimated_time_minutes} min
                    </span>
                  </div>

                  <div className="queue-item-tags">
                    {item.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Question Detail Panel */}
        <div className="question-detail">
          {selectedQuestion ? (
            <>
              <div className="detail-header">
                <h3>Question Details</h3>
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="close-btn"
                >
                  ✕
                </button>
              </div>

              <div className="detail-content">
                <div className="detail-section">
                  <h4>Student Info</h4>
                  <p><strong>Name:</strong> {selectedQuestion.student_name}</p>
                  <p><strong>Course:</strong> {selectedQuestion.course}</p>
                  <p><strong>Assigned to:</strong> {selectedQuestion.assigned_ta_name}</p>
                </div>

                <div className="detail-section">
                  <h4>Question</h4>
                  <p>{selectedQuestion.question_text}</p>
                </div>

                {selectedQuestion.code_snippet && (
                  <div className="detail-section">
                    <h4>Code Snippet</h4>
                    <pre className="code-block">{selectedQuestion.code_snippet}</pre>
                  </div>
                )}

                <div className="detail-section">
                  <h4>AI Analysis</h4>
                  <p><strong>Category:</strong> {selectedQuestion.category}</p>
                  <p><strong>Summary:</strong> {selectedQuestion.brief_summary}</p>
                  <p><strong>Tags:</strong> {selectedQuestion.tags.join(', ')}</p>
                  <p>
                    <strong>Estimated Time:</strong>{' '}
                    <span style={{ color: getDifficultyColor(selectedQuestion.estimated_time_minutes) }}>
                      {selectedQuestion.estimated_time_minutes} minutes
                    </span>
                  </p>
                </div>

                {selectedQuestion.student_friendly_hint && (
                  <div className="detail-section ai-section">
                    <h4>💡 Student Hint (from AI Synthesizer)</h4>
                    <p className="hint">{selectedQuestion.student_friendly_hint}</p>
                  </div>
                )}

                {selectedQuestion.suggested_answer_outline && (
                  <div className="detail-section ai-section">
                    <h4>📝 Suggested Teaching Approach (from AI Synthesizer)</h4>
                    <pre className="outline">{selectedQuestion.suggested_answer_outline}</pre>
                  </div>
                )}

                <div className="detail-actions">
                  <button
                    onClick={() => handleResolve(selectedQuestion.queue_id)}
                    disabled={resolving === selectedQuestion.queue_id || selectedQuestion.status === 'DONE'}
                    className="resolve-btn"
                  >
                    {resolving === selectedQuestion.queue_id
                      ? 'Resolving...'
                      : selectedQuestion.status === 'DONE'
                      ? '✓ Resolved'
                      : 'Mark as Resolved'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-detail">
              <p>Select a question from the queue to view details</p>
              <p className="muted">AI-generated insights and teaching guidance will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
