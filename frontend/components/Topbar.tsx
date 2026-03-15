'use client';

import { Moon, Sun, Menu } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface TopbarProps {
  title: string;
  onMenuClick: () => void;
}

export default function Topbar({ title, onMenuClick }: TopbarProps) {
  const { user, darkMode, toggleDarkMode } = useAuthStore();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0,2)
    : 'LF';

  return (
    <header className="topbar">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-actions">
        <button
          onClick={toggleDarkMode}
          className="theme-toggle"
          aria-label="Toggle dark mode"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="flex items-center gap-2">
          <div className="avatar" title={user?.name}>
            {initials}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
              {user?.name || 'Student'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Learner</span>
          </div>
        </div>
      </div>
    </header>
  );
}
