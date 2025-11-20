'use client';
import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import SimpleForm from '../components/SimpleForm';
import CardDisplay from '../components/CardDisplay';

export default function Home() {
  const [activeView, setActiveView] = useState('chat'); // 'chat', 'form', 'cards'
  const [results, setResults] = useState([]);

  return (
    <main className="container">
      <header>
        <h1>🚀 Claude Hackathon Project</h1>
        <nav>
          <button onClick={() => setActiveView('chat')} className={activeView === 'chat' ? 'active' : ''}>
            Chat
          </button>
          <button onClick={() => setActiveView('form')} className={activeView === 'form' ? 'active' : ''}>
            Form
          </button>
          <button onClick={() => setActiveView('cards')} className={activeView === 'cards' ? 'active' : ''}>
            Cards
          </button>
        </nav>
      </header>

      <div className="main-content">
        {activeView === 'chat' && <ChatInterface />}
        {activeView === 'form' && <SimpleForm onResults={setResults} />}
        {activeView === 'cards' && <CardDisplay items={results} />}
      </div>
    </main>
  );
}