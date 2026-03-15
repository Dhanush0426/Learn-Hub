'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getSubjects, getMyEnrollments, enrollInCourse } from '@/lib/api';
import { Subject, Enrollment, getTotalLessons, getTotalDuration, formatDuration } from '@/lib/courses';

export default function CoursesPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([getSubjects(), getMyEnrollments()])
      .then(([subs, enrolls]) => { setSubjects(subs); setEnrollments(enrolls); })
      .finally(() => setLoading(false));
  }, []);

  const isEnrolled = (id: string) => enrollments.some((e) => e.subject_id === id);

  const handleEnroll = async (subjectId: string, title: string) => {
    setEnrolling(subjectId);
    try {
      await enrollInCourse(subjectId);
      const newEnroll: Enrollment = { id: '', user_id: '', subject_id: subjectId, created_at: new Date().toISOString() };
      setEnrollments((prev) => [...prev, newEnroll]);
      toast.success(`Enrolled in "${title}"!`);
    } catch {
      toast.error('Enrollment failed. Please try again.');
    } finally {
      setEnrolling(null);
    }
  };

  const filtered = subjects.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.instructor?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-body">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Browse Courses</h1>
          <p className="page-subtitle">{subjects.length} free courses available</p>
        </div>
        <input
          type="search"
          placeholder="Search courses…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="form-input"
          style={{ width: 240 }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>No courses found.</div>
      ) : (
        <div className="grid-courses">
          {filtered.map((subject) => {
            const enrolled = isEnrolled(subject.id);
            const lessons = getTotalLessons(subject);
            const duration = formatDuration(getTotalDuration(subject));
            return (
              <div key={subject.id} className="course-card">
                <Link href={`/courses/${subject.id}`}>
                  <img
                    src={subject.thumbnail}
                    alt={subject.title}
                    className="course-card-thumb"
                    onError={(e) => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`; }}
                  />
                </Link>
                <div className="course-card-body">
                  <div className="course-card-instructor">{subject.instructor || 'LearnFlow Instructor'}</div>
                  <Link href={`/courses/${subject.id}`} style={{ textDecoration: 'none' }}>
                    <h3 className="course-card-title">{subject.title}</h3>
                  </Link>
                  <p className="course-card-desc">{subject.description}</p>
                  <div className="flex gap-3 mt-2" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    <span className="flex items-center gap-1"><BookOpen size={12} /> {lessons} lessons</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {duration}</span>
                  </div>
                </div>
                <div className="course-card-footer">
                  <span className="free-badge">FREE</span>
                  {enrolled ? (
                    <Link href={`/courses/${subject.id}`} className="btn btn-outline btn-sm">
                      <CheckCircle size={13} /> Enrolled
                    </Link>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEnroll(subject.id, subject.title)}
                      disabled={enrolling === subject.id}
                    >
                      {enrolling === subject.id ? <Loader2 size={13} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
                      Enroll Free
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
