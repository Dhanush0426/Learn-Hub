'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, Loader2 } from 'lucide-react';
import { getSubjects, getMyEnrollments, getProgress } from '@/lib/api';
import { Subject, Enrollment, getFlatVideos, getTotalLessons } from '@/lib/courses';

export default function MyCoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSubjects(), getMyEnrollments(), getProgress()])
      .then(([subs, enrolls, prog]) => {
        setSubjects(subs);
        setEnrollments(enrolls);
        setProgress(prog);
      })
      .finally(() => setLoading(false));
  }, []);

  const enrolledSubjects = subjects.filter((s) => enrollments.some((e) => e.subject_id === s.id));

  const getCourseProgress = (subject: Subject) => {
    const videos = getFlatVideos(subject);
    if (!videos.length) return { pct: 0, completed: 0, total: 0, nextVideo: videos[0] };
    const completed = videos.filter((v) => progress[v.id]?.completed).length;
    const pct = Math.round((completed / videos.length) * 100);
    // Find the first uncompleted video for resume
    const nextVideo = videos.find((v) => !progress[v.id]?.completed) || videos[videos.length - 1];
    return { pct, completed, total: videos.length, nextVideo };
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page-body">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">{enrolledSubjects.length} course{enrolledSubjects.length !== 1 ? 's' : ''} enrolled</p>
      </div>

      {enrolledSubjects.length === 0 ? (
        <div className="card card-p" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>📚</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>No courses yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Enroll in courses to start your learning journey.</p>
          <Link href="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {enrolledSubjects.map((subject) => {
            const { pct, completed, total, nextVideo } = getCourseProgress(subject);
            const enrollment = enrollments.find((e) => e.subject_id === subject.id);
            return (
              <div key={subject.id} className="card" style={{ display: 'flex', overflow: 'hidden' }}>
                <img
                  src={subject.thumbnail}
                  alt={subject.title}
                  style={{ width: 180, height: 130, objectFit: 'cover', flexShrink: 0, background: 'var(--bg-secondary)' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'; }}
                />
                <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                      {subject.instructor}
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{subject.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {subject.description}
                    </p>
                    <div style={{ marginBottom: 6 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{completed}/{total} lessons completed</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: pct === 100 ? 'var(--success)' : 'var(--accent)' }}>{pct}%</span>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    {enrollment?.created_at && (
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                        Enrolled {new Date(enrollment.created_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8, flexShrink: 0 }}>
                  {nextVideo ? (
                    <Link href={`/learn/${subject.id}/${nextVideo.id}`} className="btn btn-primary">
                      <PlayCircle size={15} /> {pct > 0 ? 'Resume' : 'Start'}
                    </Link>
                  ) : null}
                  <Link href={`/courses/${subject.id}`} className="btn btn-ghost btn-sm">View Details</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
