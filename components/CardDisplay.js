'use client';

export default function CardDisplay({ items = [] }) {
  // Sample data for demonstration
  const sampleItems = items.length > 0 ? items : [
    { id: 1, title: 'Sample Card 1', description: 'This is a placeholder card', status: 'active' },
    { id: 2, title: 'Sample Card 2', description: 'Another placeholder', status: 'pending' },
    { id: 3, title: 'Sample Card 3', description: 'Third placeholder', status: 'completed' }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#48bb78';
      case 'pending': return '#ed8936';
      case 'completed': return '#4299e1';
      default: return '#a0aec0';
    }
  };

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem'
    }}>
      {sampleItems.map(item => (
        <div key={item.id} style={{
          padding: '1.5rem',
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          background: 'white',
          transition: 'transform 0.2s, box-shadow 0.2s',
          cursor: 'pointer',
          ':hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        }}>
          {item.status && (
            <div style={{
              display: 'inline-block',
              padding: '0.25rem 0.75rem',
              background: getStatusColor(item.status),
              color: 'white',
              borderRadius: '4px',
              fontSize: '0.875rem',
              marginBottom: '1rem'
            }}>
              {item.status}
            </div>
          )}
          
          <h3 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>
            {item.title || item.topic || `Item ${item.id}`}
          </h3>
          
          <p style={{ color: '#718096', lineHeight: '1.6' }}>
            {item.description || item.content || 'No description available'}
          </p>

          <button style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            fontSize: '0.875rem',
            background: '#f7fafc',
            color: '#4299e1',
            border: '2px solid #4299e1'
          }}>
            View Details
          </button>
        </div>
      ))}
    </div>
  );
}