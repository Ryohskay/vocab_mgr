import React, { useState } from 'react';
import LanguageManager from './LanguageManager';
import VocabularyManager from './VocabularyManager';
import './index.css';

function App() {
  const [view, setView] = useState('vocabulary');

  return (
    <div className="app-container">
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          background: 'linear-gradient(to right, #818cf8, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0
        }}>
          Vocab Manager
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Conlang Lexicon & Language Database</p>
      </header>

      <nav>
        <button
          onClick={() => setView('vocabulary')}
          className={view === 'vocabulary' ? 'active' : ''}
        >
          Vocabulary
        </button>
        <button
          onClick={() => setView('languages')}
          className={view === 'languages' ? 'active' : ''}
        >
          Languages
        </button>
      </nav>

      <main>
        {view === 'languages' ? <LanguageManager /> : <VocabularyManager />}
      </main>

      <footer style={{ marginTop: 'auto', padding: '2rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        Built with Go, React, and Gin
      </footer>
    </div>
  );
}

export default App;
