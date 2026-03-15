'use client';

import { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Clock } from 'lucide-react';
import { getSubjects, getMyEnrollments, getProgress } from '@/lib/api';
import { Subject, Enrollment, getFlatVideos } from '@/lib/courses';

export default function ProgressPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubjects(), getMyEnrollments(), getProgress()])
      .then(([subs, enrolls, prog]) => { setSubjects(subs); setEnrollments(enrolls); setProgress(prog); })
      .finally(() => setLoading(false));
  }, []);

  const enrolledSubjects = subjects.filter((s) => enrollments.some((e) => e.subject_id === s.id));

  const totalVideos = enrolledSubjects.reduce((acc, s) => acc + getFlatVideos(s).length, 0);
  const completedVideos = Object.values(progress).filter((p: any) => p.completed).length;
  const overallPct = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page-body">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h1 className="page-title" style={{ marginBottom: 8 }}>My Progress</h1>
      <p className="page-subtitle" style={{ marginBottom: 28 }}>Your learning performance at a glance</p>

      {/* Overall stats */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {[
          { icon: '📚', label: 'Courses Enrolled', value: enrollments.length, color: '#6366f1', bg: '#eef2ff' },
          { icon: '✅', label: 'Lessons Completed', value: completedVideos, color: '#10b981', bg: '#ecfdf5' },
          { icon: '📈', label: 'Overall Progress', value: `${overallPct}%`, color: '#f59e0b', bg: '#fefce8' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color, fontSize: 22 }}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="card card-p" style={{ marginBottom: 24 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
          <h2 className="section-title">Overall Learning Progress</h2>
          <span style={{ fontWeight: 800, fontSize: 20, color: 'var(--accent)' }}>{overallPct}%</span>
        </div>
        <div className="progress-bar-wrap" style={{ height: 12 }}>
          <div className="progress-bar-fill" style={{ width: `${overallPct}%` }} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          {completedVideos} of {totalVideos} total lessons completed
        </div>
      </div>

      {/* Per-course breakdown */}
      <div className="card card-p">
        <h2 className="section-title" style={{ marginBottom: 20 }}>Course Breakdown</h2>
        {enrolledSubjects.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Enroll in courses to track your progress.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {enrolledSubjects.map((subject) => {
              const videos = getFlatVideos(subject);
              const completed = videos.filter((v) => progress[v.id]?.completed).length;
              const pct = videos.length > 0 ? Math.round((completed / videos.length) * 100) : 0;
              return (
                <div key={subject.id}>
                  <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{subject.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subject.instructor}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                        <CheckCircle size={12} style={{ display: 'inline', marginRight: 4, color: 'var(--success)' }} />
                        {completed}/{videos.length}
                      </span>
                      <span style={{ fontWeight: 700, color: pct === 100 ? 'var(--success)' : 'var(--accent)', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'linear-gradient(90deg, #10b981, #059669)' : undefined }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
