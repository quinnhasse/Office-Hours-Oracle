'use client';
import { useState } from 'react';

export default function SimpleForm({ onResults }) {
  const [formData, setFormData] = useState({
    topic: '',
    style: 'professional',
    length: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const prompt = `Generate content about "${formData.topic}" in a ${formData.style} style. Length: ${formData.length}.`;

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      const data = await response.json();
      setResult(data.response);
      
      if (onResults) {
        onResults([{
          id: Date.now(),
          topic: formData.topic,
          content: data.response
        }]);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Topic/Prompt:
          </label>
          <input
            type="text"
            value={formData.topic}
            onChange={(e) => setFormData({...formData, topic: e.target.value})}
            placeholder="Enter your topic..."
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Style:
          </label>
          <select 
            value={formData.style}
            onChange={(e) => setFormData({...formData, style: e.target.value})}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid #e2e8f0' }}
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
            <option value="technical">Technical</option>
          </select>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Length:
          </label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['short', 'medium', 'long'].map(length => (
              <label key={length} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  value={length}
                  checked={formData.length === length}
                  onChange={(e) => setFormData({...formData, length: e.target.value})}
                />
                {length.charAt(0).toUpperCase() + length.slice(1)}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading || !formData.topic}>
          {loading ? 'Generating...' : 'Generate with Claude'}
        </button>
      </form>

      {result && (
        <div style={{ 
          padding: '1rem', 
          background: '#f7fafc', 
          borderRadius: '8px',
          whiteSpace: 'pre-wrap'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Result:</h3>
          {result}
        </div>
      )}
    </div>
  );
}