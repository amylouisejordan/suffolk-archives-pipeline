import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const labelColors = {
  ORG: '#d97706',     // amber
  DATE: '#2563eb',    // blue
  GPE: '#059669',     // green
  PERSON: '#db2777',  // pink
  EVENT: '#7c3aed',   // purple
  DEFAULT: '#6b7280'  // gray
};

function App() {
  const [text, setText] = useState('');
  const [entities, setEntities] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5050/annotate', { text });
      setEntities(res.data);
      setError(null);
    } catch (err) {
      console.error('Annotation failed:', err);
      setError('Failed to annotate. Is the backend running?');
    }
  };

  return (
    <main className="App" style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif', maxWidth: '700px', margin: 'auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>🗂 Suffolk Archives NER Explorer</h1>

      <label htmlFor="text-input" style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
        Paste historical text:
      </label>
      <textarea
        id="text-input"
        rows={6}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="e.g. Washington Colliery was active in 1845..."
        style={{
          width: '100%',
          padding: '1rem',
          fontSize: '1rem',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '1rem'
        }}
      />

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '0.6rem 1.2rem',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem'
        }}
      >
        🔍 Annotate
      </button>

      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      {entities.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📌 Extracted Entities</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {entities.map((e, i) => {
              const color = labelColors[e.label] || labelColors.DEFAULT;
              return (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      backgroundColor: color,
                      color: 'white',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      marginRight: '0.5rem',
                      display: 'inline-block',
                      minWidth: '60px',
                      textAlign: 'center'
                    }}
                  >
                    {e.label}
                  </span>
                  <span style={{ fontSize: '1rem' }}>{e.text}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </main>
  );
}

export default App;
