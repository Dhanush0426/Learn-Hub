'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShoppingBag } from 'lucide-react';
import { getMyEnrollments, getSubjects } from '@/lib/api';
import { Subject, Enrollment } from '@/lib/courses';

export default function OrdersPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyEnrollments(), getSubjects()])
      .then(([e, s]) => { setEnrollments(e); setSubjects(s); })
      .finally(() => setLoading(false));
  }, []);

  const getSubject = (id: string) => subjects.find((s) => s.id === id);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page-body">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h1 className="page-title" style={{ marginBottom: 8 }}>Order History</h1>
      <p className="page-subtitle" style={{ marginBottom: 28 }}>Your course enrollment history</p>

      {enrollments.length === 0 ? (
        <div className="card card-p" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <ShoppingBag size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No orders yet. Enroll in courses to see your history.</p>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ORDER #</th>
                <th>COURSE</th>
                <th>INSTRUCTOR</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e, i) => {
                const subject = getSubject(e.subject_id);
                return (
                  <tr key={e.id}>
                    <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 12 }}>#{String(i + 1).padStart(4, '0')}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 14 }}>
                        {subject?.title || e.subject_id}
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{subject?.instructor || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                      {e.created_at ? new Date(e.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td>
                      <span className="badge badge-success">FREE</span>
                    </td>
                    <td>
                      <span className="badge badge-accent">Enrolled</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
