'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, BookOpen, Loader2, PlayCircle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { getSubjectTree, getMyEnrollments, enrollInCourse } from '@/lib/api';
import { Subject, Enrollment, getTotalLessons, getTotalDuration, formatDuration } from '@/lib/courses';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([getSubjectTree(id), getMyEnrollments()])
      .then(([sub, enrolls]) => {
        setSubject(sub);
        setEnrollments(enrolls);
        // Open all sections by default
        const open: Record<string, boolean> = {};
        sub.sections?.forEach((s: any) => { open[s.id] = true; });
        setOpenSections(open);
      })
      .catch(() => toast.error('Failed to load course'))
      .finally(() => setLoading(false));
  }, [id]);

  const isEnrolled = enrollments.some((e) => e.subject_id === id);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollInCourse(id);
      setEnrollments((prev) => [...prev, { id: '', user_id: '', subject_id: id, created_at: '' }]);
      toast.success('Successfully enrolled!');
    } catch {
      toast.error('Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleContinue = () => {
    const first = subject?.sections?.[0]?.videos?.[0];
    if (first) router.push(`/learn/${id}/${first.id}`);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!subject) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Course not found.</div>;

  const totalLessons = getTotalLessons(subject);
  const totalDuration = formatDuration(getTotalDuration(subject));

  return (
    <div className="page-body">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Hero */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 0 }}>
          <div style={{ padding: '36px 40px' }}>
            <div style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.06em' }}>
              {subject.instructor}
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.3 }}>{subject.title}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{subject.description}</p>
            <div className="flex gap-4" style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 28 }}>
              <span className="flex items-center gap-1"><BookOpen size={14} /> {totalLessons} lessons</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {totalDuration} total</span>
              <span className="badge badge-success">Free</span>
            </div>
            {isEnrolled ? (
              <button className="btn btn-primary btn-lg" onClick={handleContinue}>
                <PlayCircle size={18} /> Continue Learning
              </button>
            ) : (
              <button className="btn btn-primary btn-lg" onClick={handleEnroll} disabled={enrolling}>
                {enrolling ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
                Enroll for Free
              </button>
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <img
              src={subject.thumbnail}
              alt={subject.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: 280 }}
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80'; }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 80%, var(--surface))', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* Curriculum */}
      <div className="card card-p">
        <h2 className="section-title" style={{ marginBottom: 20 }}>Course Curriculum</h2>
        {subject.sections?.sort((a, b) => a.order_index - b.order_index).map((section) => (
          <div key={section.id} style={{ marginBottom: 12 }}>
            <button
              className="flex items-center justify-between w-full"
              style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600, fontSize: 14 }}
              onClick={() => setOpenSections(p => ({ ...p, [section.id]: !p[section.id] }))}
            >
              <span>{section.title}</span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 400 }}>{section.videos?.length} lessons</span>
                <ChevronDown size={16} style={{ color: 'var(--text-muted)', transition: 'transform 0.2s', transform: openSections[section.id] ? 'rotate(180deg)' : 'none' }} />
              </div>
            </button>
            {openSections[section.id] && (
              <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
                {section.videos?.sort((a, b) => a.order_index - b.order_index).map((video) => (
                  <div key={video.id} className="flex items-center gap-3" style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <PlayCircle size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{video.title}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{formatDuration(video.duration_seconds)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
