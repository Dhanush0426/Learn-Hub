'use client';

import { useState, useEffect } from 'react';
import { Loader2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { getQuizzes, submitQuizAttempt } from '@/lib/api';
import { Quiz, QuizQuestion } from '@/lib/courses';

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; total: number } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getQuizzes().then(setQuizzes).finally(() => setLoading(false));
  }, []);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!selectedQuiz) return;
    const unanswered = selectedQuiz.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) { toast.error(`Please answer all ${selectedQuiz.questions.length} questions`); return; }
    setSubmitting(true);
    try {
      const res = await submitQuizAttempt(selectedQuiz.id, answers);
      setResult(res);
    } catch {
      toast.error('Quiz submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  // Quiz selection
  if (!selectedQuiz) return (
    <div className="page-body">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <h1 className="page-title" style={{ marginBottom: 8 }}>Quiz & Practice</h1>
      <p className="page-subtitle" style={{ marginBottom: 28 }}>Test your knowledge with course quizzes</p>
      {quizzes.length === 0 ? (
        <div className="card card-p" style={{ textAlign: 'center', padding: '60px 40px', color: 'var(--text-muted)' }}>
          <Trophy size={36} style={{ margin: '0 auto 12px' }} />
          No quizzes available yet. Enroll in courses to unlock quizzes.
        </div>
      ) : (
        <div className="grid-2">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="card card-p" style={{ cursor: 'pointer' }} onClick={() => startQuiz(quiz)}>
              <div style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.06em' }}>
                {quiz.subject_title}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{quiz.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                {quiz.questions?.length || 0} multiple choice questions
              </p>
              <button className="btn btn-primary btn-sm">Start Quiz →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Result screen
  if (result) {
    const pct = Math.round((result.score / result.total) * 100);
    const passed = pct >= 70;
    return (
      <div className="page-body" style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="card card-p" style={{ textAlign: 'center', padding: '48px 40px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{pct === 100 ? '🏆' : passed ? '🎉' : '📖'}</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: 'var(--text-primary)' }}>
            {pct === 100 ? 'Perfect Score!' : passed ? 'Great Job!' : 'Keep Practicing!'}
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 24 }}>
            You answered <strong>{result.score}</strong> out of <strong>{result.total}</strong> questions correctly
          </p>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 16, padding: '20px 32px', display: 'inline-block', marginBottom: 28 }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: passed ? 'var(--success)' : 'var(--danger)' }}>{pct}%</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{passed ? 'Passed' : 'Try again'}</div>
          </div>
          <div className="flex gap-3" style={{ justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={() => startQuiz(selectedQuiz)}>Retake Quiz</button>
            <button className="btn btn-ghost" onClick={() => { setSelectedQuiz(null); setResult(null); }}>All Quizzes</button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz taking
  return (
    <div className="page-body" style={{ maxWidth: 700, margin: '0 auto' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div className="flex items-center gap-3" style={{ marginBottom: 28 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedQuiz(null)}>← Back</button>
        <div>
          <h1 className="page-title">{selectedQuiz.title}</h1>
          <p className="page-subtitle">{selectedQuiz.questions?.length} questions · {selectedQuiz.subject_title}</p>
        </div>
      </div>

      {selectedQuiz.questions?.map((q, qi) => (
        <div key={q.id} className="card card-p" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>QUESTION {qi + 1}</div>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16, lineHeight: 1.5 }}>{q.question}</h3>
          {(typeof q.options === 'string' ? JSON.parse(q.options) : q.options).map((opt: string, idx: number) => (
            <div
              key={idx}
              className={`quiz-option ${answers[q.id] === idx ? 'selected' : ''}`}
              onClick={() => setAnswers((p) => ({ ...p, [q.id]: idx }))}
            >
              <div style={{ width: 24, height: 24, borderRadius: '50%', border: `2px solid ${answers[q.id] === idx ? 'var(--accent)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: answers[q.id] === idx ? 'var(--accent)' : 'var(--text-muted)', flexShrink: 0 }}>
                {String.fromCharCode(65 + idx)}
              </div>
              {opt}
            </div>
          ))}
        </div>
      ))}

      <div className="flex items-center justify-between" style={{ marginTop: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          {Object.keys(answers).length}/{selectedQuiz.questions?.length} answered
        </span>
        <button className="btn btn-primary btn-lg" onClick={handleSubmit} disabled={submitting}>
          {submitting ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Trophy size={16} />}
          Submit Quiz
        </button>
      </div>
    </div>
  );
}
