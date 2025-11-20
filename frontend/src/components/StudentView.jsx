import { useState, useEffect } from 'react'

export default function StudentView({ apiBase }) {
  const [formData, setFormData] = useState({
    student_name: '',
    course: 'CS 300',
    question_text: '',
    code_snippet: '',
    preferred_ta_id: null
  })

  const [tas, setTas] = useState([])
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch TAs on mount
  useEffect(() => {
    fetch(`${apiBase}/api/tas`)
      .then(res => res.json())
      .then(data => setTas(data))
      .catch(err => console.error('Failed to fetch TAs:', err))
  }, [apiBase])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(`${apiBase}/api/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error('Failed to submit question')

      const data = await res.json()
      setResponse(data)

      // Reset form
      setFormData({
        student_name: '',
        course: 'CS 300',
        question_text: '',
        code_snippet: '',
        preferred_ta_id: null
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preferred_ta_id' ? (value ? parseInt(value) : null) : value
    }))
  }

  return (
    <div className="student-view">
      <h2>Submit Your Question</h2>

      <form onSubmit={handleSubmit} className="question-form">
        <div className="form-group">
          <label htmlFor="student_name">Your Name *</label>
          <input
            type="text"
            id="student_name"
            name="student_name"
            value={formData.student_name}
            onChange={handleChange}
            required
            placeholder="Jane Smith"
          />
        </div>

        <div className="form-group">
          <label htmlFor="course">Course *</label>
          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="CS 200">CS 200 - Programming I</option>
            <option value="CS 300">CS 300 - Programming II</option>
            <option value="CS 354">CS 354 - Machine Organization</option>
            <option value="CS 400">CS 400 - Data Structures</option>
            <option value="CS 577">CS 577 - Algorithms</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="preferred_ta_id">Preferred TA (Optional)</label>
          <select
            id="preferred_ta_id"
            name="preferred_ta_id"
            value={formData.preferred_ta_id || ''}
            onChange={handleChange}
          >
            <option value="">No Preference (Recommended)</option>
            {tas.map(ta => (
              <option key={ta.id} value={ta.id}>
                {ta.name} - {ta.expertise_tags.join(', ')} ({ta.current_queue_count} in queue)
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="question_text">Question *</label>
          <textarea
            id="question_text"
            name="question_text"
            value={formData.question_text}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Describe your question in detail..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="code_snippet">Code Snippet (Optional)</label>
          <textarea
            id="code_snippet"
            name="code_snippet"
            value={formData.code_snippet}
            onChange={handleChange}
            rows={8}
            placeholder="Paste relevant code here..."
            style={{ fontFamily: 'monospace' }}
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Analyzing Question...' : 'Submit Question'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="response-card">
          <h3>✅ Question Submitted Successfully!</h3>

          <div className="response-section">
            <h4>📋 Analysis</h4>
            <p><strong>Category:</strong> {response.category}</p>
            <p><strong>Summary:</strong> {response.brief_summary}</p>
            <p><strong>Tags:</strong> {response.tags.join(', ')}</p>
          </div>

          <div className="response-section highlight">
            <h4>👨‍🏫 Assigned TA</h4>
            <p className="assigned-ta">{response.assigned_ta_name}</p>
            <p><strong>Estimated Wait:</strong> ~{response.estimated_wait_minutes} minutes</p>
          </div>

          {response.similar_questions.length > 0 && (
            <div className="response-section">
              <h4>💡 Similar Past Questions</h4>
              <p>Your question is similar to {response.similar_questions.length} previous question(s) in our knowledge base. The TA will have suggested solution patterns ready!</p>
            </div>
          )}

          <div className="info-box">
            <p>🔔 Your question has been added to the queue. Check the TA Dashboard to see real-time updates!</p>
          </div>
        </div>
      )}
    </div>
  )
}
