'use client';

import { useState } from 'react';
import { Loader2, Moon, Sun, Bell, User, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { updateMe } from '@/lib/api';

export default function SettingsPage() {
  const { user, setUser, darkMode, toggleDarkMode } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, assignments: true, newCourses: false });

  const handleSaveName = async () => {
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setSaving(true);
    try {
      await updateMe(name.trim());
      setUser({ ...user!, name: name.trim() });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
        background: checked ? 'var(--accent)' : 'var(--border)',
        position: 'relative', transition: 'background 0.2s',
        padding: 0, flexShrink: 0
      }}
    >
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: checked ? 22 : 3,
        transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
      }} />
    </button>
  );

  return (
    <div className="page-body" style={{ maxWidth: 640, margin: '0 auto' }}>
      <h1 className="page-title" style={{ marginBottom: 8 }}>Settings</h1>
      <p className="page-subtitle" style={{ marginBottom: 28 }}>Manage your account and preferences</p>

      {/* Profile */}
      <div className="card card-p" style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
          <User size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="section-title">Profile</h2>
        </div>
        <div className="form-group">
          <label className="form-label">Display Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            value={user?.email || ''}
            disabled
            style={{ opacity: 0.6 }}
          />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Email cannot be changed</div>
        </div>
        <button className="btn btn-primary" onClick={handleSaveName} disabled={saving}>
          {saving ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
          Save Changes
        </button>
      </div>

      {/* Appearance */}
      <div className="card card-p" style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
          {darkMode ? <Moon size={18} style={{ color: 'var(--accent)' }} /> : <Sun size={18} style={{ color: 'var(--accent)' }} />}
          <h2 className="section-title">Appearance</h2>
        </div>
        <div className="flex items-center justify-between" style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>Dark Mode</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Switch between light and dark themes</div>
          </div>
          <Toggle checked={darkMode} onChange={() => toggleDarkMode()} />
        </div>
      </div>

      {/* Notifications */}
      <div className="card card-p">
        <div className="flex items-center gap-2" style={{ marginBottom: 20 }}>
          <Bell size={18} style={{ color: 'var(--accent)' }} />
          <h2 className="section-title">Notifications</h2>
        </div>
        {[
          { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
          { key: 'assignments', label: 'Assignment Reminders', desc: 'Get reminded about due assignments' },
          { key: 'newCourses', label: 'New Course Alerts', desc: 'Be notified when new courses are added' },
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</div>
            </div>
            <Toggle
              checked={notifications[key as keyof typeof notifications]}
              onChange={(v) => { setNotifications((p) => ({ ...p, [key]: v })); toast.success(`${label} ${v ? 'enabled' : 'disabled'}`); }}
            />
          </div>
        ))}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
