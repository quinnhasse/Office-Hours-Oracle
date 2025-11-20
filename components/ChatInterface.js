'use client';
import { useState } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: input,
          system: "You are a helpful assistant in a hackathon project."
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', content: `Error: ${error.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '450px' }}>
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '1rem', 
        background: '#f7fafc',
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        {messages.length === 0 && (
          <p style={{ color: '#718096', textAlign: 'center' }}>Start a conversation with Claude...</p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            background: msg.role === 'user' ? '#4299e1' : msg.role === 'error' ? '#f56565' : 'white',
            color: msg.role === 'user' || msg.role === 'error' ? 'white' : 'black',
            borderRadius: '8px',
            marginLeft: msg.role === 'user' ? '20%' : '0',
            marginRight: msg.role === 'assistant' ? '20%' : '0'
          }}>
            <strong>{msg.role}:</strong> {msg.content}
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', color: '#718096' }}>
            <span className="loading">⏳</span> Claude is thinking...
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Type your message..."
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </button>
      </div>
    </div>
  );
}