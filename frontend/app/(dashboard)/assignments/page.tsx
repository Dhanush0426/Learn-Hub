'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, Calendar, Loader2, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { getAssignments, submitAssignment } from '@/lib/api';
import { Assignment } from '@/lib/courses';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [modal, setModal] = useState<{ asgn: Assignment; content: string } | null>(null);

  useEffect(() => {
    getAssignments().then(setAssignments).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!modal) return;
    if (!modal.content.trim()) { toast.error('Please write your submission'); return; }
    setSubmitting(modal.asgn.id);
    try {
      await submitAssignment(modal.asgn.id, modal.content);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === modal.asgn.id
            ? { ...a, submission_id: 'new', submission_content: modal.content, submitted_at: new Date().toISOString() }
            : a
        )
      );
      toast.success('Assignment submitted successfully!');
      setModal(null);
    } catch {
      toast.error('Submission failed. Please try again.');
    } finally {
      setSubmitting(null);
    }
  };

  const isOverdue = (date: string | null) => date && new Date(date) < new Date();

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div className="page-body">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h1 className="page-title" style={{ marginBottom: 8 }}>Assignments</h1>
      <p className="page-subtitle" style={{ marginBottom: 28 }}>
        {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} in your enrolled courses
      </p>

      {assignments.length === 0 ? (
        <div className="card card-p" style={{ textAlign: 'center', padding: '60px 40px' }}>
          <ClipboardCheck size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No assignments yet. Enroll in courses to see assignments.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {assignments.map((asgn) => {
            const submitted = !!asgn.submission_id;
            const overdue = isOverdue(asgn.due_date);
            return (
              <div key={asgn.id} className="card card-p">
                <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4, display: 'block' }}>
                      {asgn.subject_title}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>{asgn.title}</h3>
                  </div>
                  {submitted
                    ? <span className="badge badge-success"><CheckCircle size={11} style={{ marginRight: 4 }} /> Submitted</span>
                    : overdue
                    ? <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--danger)' }}>Overdue</span>
                    : <span className="badge badge-warning"><Clock size={11} style={{ marginRight: 4 }} /> Pending</span>
                  }
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 14 }}>{asgn.description}</p>
                {asgn.due_date && (
                  <div className="flex items-center gap-1" style={{ fontSize: 12, color: overdue && !submitted ? 'var(--danger)' : 'var(--text-muted)', marginBottom: 12 }}>
                    <Calendar size={12} />
                    Due: {new Date(asgn.due_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
                {submitted && asgn.submission_content ? (
                  <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: 12, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-secondary)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>YOUR SUBMISSION</div>
                    {asgn.submission_content}
                  </div>
                ) : (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setModal({ asgn, content: '' })}
                    disabled={!!submitting}
                  >
                    Submit Assignment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Submit modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setModal(null)}>
          <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 32, maxWidth: 520, width: '100%', border: '1px solid var(--border)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>{modal.asgn.title}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>Write your submission below.</p>
            <div className="form-group">
              <label className="form-label">Your Answer</label>
              <textarea
                className="form-input"
                placeholder="Write your assignment response here…"
                value={modal.content}
                onChange={(e) => setModal({ ...modal, content: e.target.value })}
                style={{ minHeight: 150 }}
              />
            </div>
            <div className="flex gap-3">
              <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={!!submitting}>
                {submitting ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : null}
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
