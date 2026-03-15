'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Users, CheckCircle, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getSubjects, getMyEnrollments, getProgress } from '@/lib/api';
import { Subject, Enrollment } from '@/lib/courses';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubjects(), getMyEnrollments(), getProgress()])
      .then(([subs, enrolls, prog]) => {
        setSubjects(subs);
        setEnrollments(enrolls);
        const completed = Object.values(prog as Record<string, any>).filter((p: any) => p.completed).length;
        setCompletedLessons(completed);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { icon: '📚', label: 'Available Courses', value: subjects.length, color: '#6366f1', bg: '#eef2ff' },
    { icon: '🎓', label: 'Enrolled Courses', value: enrollments.length, color: '#8b5cf6', bg: '#f5f3ff' },
    { icon: '✅', label: 'Completed Lessons', value: completedLessons, color: '#10b981', bg: '#ecfdf5' },
    { icon: '🚀', label: 'In Progress', value: Math.max(0, enrollments.length - 0), color: '#f59e0b', bg: '#fefce8' },
  ];

  const enrolledSubjects = subjects.filter(s => enrollments.some(e => e.subject_id === s.id));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page-body">
      {/* Welcome */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="page-title" style={{ fontSize: 26 }}>
          {greeting}, {user?.name?.split(' ')[0] || 'Student'} 👋
        </h2>
        <p className="page-subtitle">Track your learning journey and keep the momentum going.</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color, fontSize: 22 }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-value">{loading ? '–' : s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Continue Learning */}
        <div className="card card-p">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Continue Learning</h2>
            <Link href="/my-courses" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading…</div>
          ) : enrolledSubjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📖</div>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>You haven't enrolled in any courses yet.</p>
              <Link href="/courses" className="btn btn-primary btn-sm">Browse Courses</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enrolledSubjects.slice(0, 4).map((s) => {
                const firstSection = s.sections?.[0];
                const firstVideo = firstSection?.videos?.[0];
                return (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <img
                      src={s.thumbnail}
                      alt={s.title}
                      style={{ width: 50, height: 38, borderRadius: 6, objectFit: 'cover', flexShrink: 0, background: 'var(--bg-secondary)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.instructor}</div>
                    </div>
                    {firstVideo ? (
                      <Link href={`/learn/${s.id}/${firstVideo.id}`} className="btn btn-outline btn-sm" style={{ flexShrink: 0 }}>
                        <ArrowRight size={13} /> Go
                      </Link>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="card card-p">
          <h2 className="section-title" style={{ marginBottom: 16 }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { href: '/courses', icon: BookOpen, label: 'Browse All Courses', desc: `${subjects.length} courses available` },
              { href: '/assignments', icon: CheckCircle, label: 'Check Assignments', desc: 'View and submit assignments' },
              { href: '/quiz', icon: TrendingUp, label: 'Take a Quiz', desc: 'Practice your knowledge' },
              { href: '/ai-assistant', icon: Users, label: 'AI Learning Assistant', desc: 'Get help with any topic' },
              { href: '/progress', icon: Clock, label: 'View My Progress', desc: 'Track learning stats' },
            ].map(({ href, icon: Icon, label, desc }) => (
              <Link key={href} href={href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--border)', textDecoration: 'none', transition: 'all 0.15s' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--accent-muted)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
