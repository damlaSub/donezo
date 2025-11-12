import React, { FC, useState, Suspense } from 'react';
import './App.css';
const NotesPage = React.lazy(() => import('./components/TasksPage'));
const CalendarPage = React.lazy(() => import('./components/CalendarPage'));
const PomodoroPage = React.lazy(() => import('./components/PomodoroPage'));

const TABS = [
  { key: 'notes', label: 'Notes', icon: '📝' },
  { key: 'calendar', label: 'Calendar', icon: '📅' },
  { key: 'pomodoro', label: 'Pomodoro', icon: '⏱️' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const PAGES: Record<TabKey, FC> = {
  notes: NotesPage,
  calendar: CalendarPage,
  pomodoro: PomodoroPage,
};

const App: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('notes');
  const Page = PAGES[tab];

  return (
    <div className="app-container">
      {
        <Suspense key={tab} fallback={<div style={{ padding: 24 }}>Loading {tab}…</div>}>
          <Page />
        </Suspense>
      }
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
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`nav-button ${tab === t.key ? 'active' : ''}`}
            aria-label={t.label}
          >
            <span className="nav-icon">{t.icon}</span>
            <span className="nav-label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;
