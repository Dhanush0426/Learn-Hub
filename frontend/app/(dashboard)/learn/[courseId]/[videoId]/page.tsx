'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Circle, Lock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import YouTube from 'react-youtube';
import { getSubjectTree, getProgress, updateVideoProgress } from '@/lib/api';
import { Subject, Video, getFlatVideos } from '@/lib/courses';

export default function LearnPage() {
  const { courseId, videoId } = useParams<{ courseId: string; videoId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const playerRef = useRef<any>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Promise.all([getSubjectTree(courseId), getProgress()])
      .then(([sub, prog]) => { setSubject(sub); setProgress(prog); })
      .catch(() => toast.error('Failed to load course'))
      .finally(() => setLoading(false));
  }, [courseId]);

  const allVideos = subject ? getFlatVideos(subject) : [];
  const currentIdx = allVideos.findIndex((v) => v.id === videoId);
  const currentVideo = allVideos[currentIdx] || null;
  const prevVideo = allVideos[currentIdx - 1] || null;
  const nextVideo = allVideos[currentIdx + 1] || null;

  // Is a video unlocked? First video always unlocked; subsequent require previous completed.
  const isUnlocked = useCallback((idx: number): boolean => {
    if (idx === 0) return true;
    const prev = allVideos[idx - 1];
    return !!progress[prev?.id]?.completed;
  }, [allVideos, progress]);

  // Periodic progress save every 15s
  const startProgressTimer = useCallback(() => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    progressTimer.current = setInterval(async () => {
      if (playerRef.current) {
        try {
          const t = await playerRef.current.getCurrentTime();
          if (t > 0) {
            await updateVideoProgress(videoId, Math.floor(t), false);
            setProgress((p) => ({
              ...p,
              [videoId]: { ...p[videoId], videoId, timestamp: Math.floor(t) },
            }));
          }
        } catch {}
      }
    }, 15000);
  }, [videoId]);

  useEffect(() => {
    return () => { if (progressTimer.current) clearInterval(progressTimer.current); };
  }, [videoId]);

  const handlePlayerReady = async (event: any) => {
    playerRef.current = event.target;
    const saved = progress[videoId]?.timestamp;
    if (saved && saved > 5) {
      event.target.seekTo(saved, true);
      toast.info(`Resuming from ${Math.floor(saved / 60)}:${String(saved % 60).padStart(2, '0')}`);
    }
    startProgressTimer();
  };

  const handleVideoEnd = async () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
    try {
      await updateVideoProgress(videoId, 0, true);
      setProgress((p) => ({ ...p, [videoId]: { videoId, timestamp: 0, completed: true } }));
      toast.success('Lesson completed! 🎉');
    } catch {}
  };

  const handleMarkComplete = async () => {
    setMarking(true);
    try {
      const t = playerRef.current ? Math.floor(await playerRef.current.getCurrentTime()) : 0;
      await updateVideoProgress(videoId, t, true);
      setProgress((p) => ({ ...p, [videoId]: { videoId, timestamp: t, completed: true } }));
      toast.success('Marked as completed!');
    } catch {
      toast.error('Failed to mark as completed');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
      <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: 'var(--accent)' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!subject || !currentVideo) return (
    <div style={{ padding: 40, color: 'var(--text-muted)' }}>
      Lesson not found. <Link href="/my-courses" style={{ color: 'var(--accent)' }}>Go back</Link>
    </div>
  );

  const isCompleted = !!progress[videoId]?.completed;

  return (
    <div className="learn-layout">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Main area */}
      <div className="learn-main">
        {/* Video */}
        <div className="video-container">
          <YouTube
            videoId={currentVideo.youtube_video_id}
            opts={{ playerVars: { autoplay: 0, rel: 0, modestbranding: 1 } }}
            onReady={handlePlayerReady}
            onEnd={handleVideoEnd}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* Controls */}
        <div className="card card-p" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>
                {currentVideo.title}
              </h1>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{subject.title}</div>
            </div>
            {isCompleted ? (
              <div className="badge badge-success" style={{ fontSize: 13, padding: '6px 14px' }}>
                <CheckCircle size={14} style={{ marginRight: 6 }} /> Completed
              </div>
            ) : (
              <button
                className="btn btn-outline"
                onClick={handleMarkComplete}
                disabled={marking}
              >
                {marking ? <Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> : <CheckCircle size={15} />}
                Mark as Completed
              </button>
            )}
          </div>

          {currentVideo.description && (
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {currentVideo.description}
            </p>
          )}

          <div className="flex gap-3">
            {prevVideo ? (
              <Link href={`/learn/${courseId}/${prevVideo.id}`} className="btn btn-ghost">
                <ChevronLeft size={16} /> Previous
              </Link>
            ) : <div />}
            {nextVideo && isUnlocked(currentIdx + 1) ? (
              <Link href={`/learn/${courseId}/${nextVideo.id}`} className="btn btn-primary" style={{ marginLeft: 'auto' }}>
                Next <ChevronRight size={16} />
              </Link>
            ) : nextVideo ? (
              <button className="btn btn-ghost" disabled style={{ marginLeft: 'auto', cursor: 'not-allowed' }}>
                <Lock size={15} /> Complete this lesson first
              </button>
            ) : (
              <div style={{ marginLeft: 'auto' }}>
                <Link href="/my-courses" className="btn btn-primary">🎉 Course Complete</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lesson sidebar */}
      <div className="lesson-sidebar">
        <div className="lesson-sidebar-header">
          {subject.title}
          <div style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)', marginTop: 2 }}>
            {allVideos.filter((v) => progress[v.id]?.completed).length}/{allVideos.length} completed
          </div>
        </div>

        {subject.sections?.sort((a, b) => a.order_index - b.order_index).map((section) => (
          <div key={section.id} className="section-group">
            <div className="section-header">{section.title}</div>
            {section.videos?.sort((a, b) => a.order_index - b.order_index).map((video) => {
              const vidIdx = allVideos.findIndex((v) => v.id === video.id);
              const unlocked = isUnlocked(vidIdx);
              const completed = !!progress[video.id]?.completed;
              const active = video.id === videoId;

              if (!unlocked) {
                return (
                  <div key={video.id} className="lesson-item locked">
                    <Lock size={13} className="lesson-icon" />
                    {video.title}
                  </div>
                );
              }

              return (
                <Link
                  key={video.id}
                  href={`/learn/${courseId}/${video.id}`}
                  className={`lesson-item ${active ? 'active' : ''} ${completed && !active ? 'completed' : ''}`}
                  style={{ textDecoration: 'none' }}
                >
                  {completed
                    ? <CheckCircle size={13} className="lesson-icon" />
                    : active
                    ? <div style={{ width: 13, height: 13, borderRadius: '50%', border: '2px solid var(--accent)', flexShrink: 0 }} />
                    : <Circle size={13} className="lesson-icon" />
                  }
                  {video.title}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
