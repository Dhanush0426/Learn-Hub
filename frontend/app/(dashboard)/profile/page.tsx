'use client';

import { useEffect, useState } from 'react';
import { Loader2, Mail, Calendar, BookOpen, CheckCircle } from 'lucide-react';
import { getMe } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe().then((data) => { setProfile(data); setUser(data); }).finally(() => setLoading(false));
  }, [setUser]);

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'LF';

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page-body" style={{ maxWidth: 720, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {/* Profile Header */}
      <div className="card card-p" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="avatar avatar-xl">{initials}</div>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{profile?.name}</h1>
          <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            <Mail size={14} /> {profile?.email}
          </div>
          {profile?.created_at && (
            <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              <Calendar size={13} /> Joined {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#eef2ff', color: '#6366f1', fontSize: 22 }}>📚</div>
          <div>
            <div className="stat-value">{profile?.enrolledCourses || 0}</div>
            <div className="stat-label">Courses Enrolled</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981', fontSize: 22 }}>✅</div>
          <div>
            <div className="stat-value">{profile?.completedLessons || 0}</div>
            <div className="stat-label">Lessons Completed</div>
          </div>
        </div>
      </div>

      {/* Info table */}
      <div className="card card-p">
        <h2 className="section-title" style={{ marginBottom: 20 }}>Account Information</h2>
        {[
          { label: 'Full Name', value: profile?.name || '—' },
          { label: 'Email Address', value: profile?.email || '—' },
          { label: 'Member Since', value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
          { label: 'Account Status', value: <span className="badge badge-success">Active</span> },
        ].map((row) => (
          <div key={row.label} style={{ display: 'flex', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ width: 160, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>{row.label}</div>
            <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
