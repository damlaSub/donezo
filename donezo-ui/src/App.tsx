import React, { useState } from 'react';
import NotesPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import PomodoroPage from './components/PomodoroPage';

const TABS = [
  { key: 'notes', label: 'Notes', icon: '📝' },
  { key: 'calendar', label: 'Calendar', icon: '📅' },
  { key: 'pomodoro', label: 'Pomodoro', icon: '⏱️' },
];

const App: React.FC = () => {
  const [tab, setTab] = useState('notes');

  let PageComponent;
  if (tab === 'notes') PageComponent = <NotesPage />;
  else if (tab === 'calendar') PageComponent = <CalendarPage />;
  else if (tab === 'pomodoro') PageComponent = <PomodoroPage />;

  return (
    <div style={{ minHeight: '100vh', background: '#fafafa', paddingBottom: '64px' }}>
      {PageComponent}
      <nav
        style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          height: '56px',
          background: '#fff',
          borderTop: '1px solid #eee',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1001,
        }}
      >
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: tab === t.key ? '#1976d2' : '#888',
              fontSize: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              outline: 'none',
              cursor: 'pointer',
            }}
            aria-label={t.label}
          >
            <span style={{ fontSize: '24px' }}>{t.icon}</span>
            <span style={{ fontSize: '12px', marginTop: '2px' }}>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
