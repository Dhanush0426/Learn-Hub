import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSidebarStore } from "@/store/sidebarStore";
import { useVideoStore } from "@/store/videoStore";
import { SubjectSidebar } from "@/components/SubjectSidebar";
import { VideoPlayer } from "@/components/VideoPlayer";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function VideoPage() {
  const { subjectId, videoId } = useParams<{ subjectId: string; videoId: string }>();
  const navigate = useNavigate();
  const { subject, progress, isLoading, loadSubject, setActiveVideo, getAllVideosFlat } = useSidebarStore();
  const { setCurrentVideo } = useVideoStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (subjectId) loadSubject(subjectId);
  }, [subjectId, loadSubject]);

  useEffect(() => {
    if (videoId) setActiveVideo(videoId);
  }, [videoId, setActiveVideo]);

  useEffect(() => {
    if (subject && videoId) {
      for (const section of subject.sections) {
        const video = section.videos.find((v) => v.id === videoId);
        if (video) {
          const savedTimestamp = progress[videoId]?.timestamp || 0;
          setCurrentVideo(video, savedTimestamp);
          break;
        }
      }
    }
  }, [subject, videoId, progress, setCurrentVideo]);

  if (isLoading || !subject) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const flatVideos = getAllVideosFlat();
  const currentIndex = flatVideos.findIndex((v) => v.id === videoId);
  const currentVideo = subject.sections.flatMap((s) => s.videos).find((v) => v.id === videoId);

  if (!currentVideo) return null;

  const allVideoIds = flatVideos.map((v) => v.id);
  const isVideoUnlocked = (vid: string) => {
    const idx = allVideoIds.indexOf(vid);
    if (idx === 0) return true;
    return !!progress[allVideoIds[idx - 1]]?.completed;
  };

  const prevVideo = currentIndex > 0 ? flatVideos[currentIndex - 1] : null;
  const nextVideo = currentIndex < flatVideos.length - 1 ? flatVideos[currentIndex + 1] : null;
  const canGoNext = nextVideo && isVideoUnlocked(nextVideo.id);

  const completedCount = allVideoIds.filter((id) => progress[id]?.completed).length;
  const progressPercent = allVideoIds.length > 0 ? (completedCount / allVideoIds.length) * 100 : 0;

  return (
    <div className="flex min-h-svh bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-80 shrink-0 border-r border-border lg:block">
        <SubjectSidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-80 bg-sidebar shadow-xl">
            <div className="flex items-center justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <SubjectSidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-sm font-medium text-foreground truncate">{subject.title}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl p-4 md:p-6 space-y-6">
            {/* Video player */}
            <VideoPlayer
              youtubeId={currentVideo.youtubeId}
              videoId={currentVideo.id}
              startAt={progress[currentVideo.id]?.timestamp || 0}
            />

            {/* Video info */}
            <div>
              <h1 className="text-xl font-bold text-foreground">{currentVideo.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {flatVideos[currentIndex]?.sectionTitle}
              </p>
            </div>

            {/* Progress bar */}
            <ProgressBar value={progressPercent} showLabel />

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                disabled={!prevVideo}
                onClick={() => prevVideo && navigate(`/subjects/${subjectId}/video/${prevVideo.id}`)}
                className="gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {flatVideos.length}
              </span>
              <Button
                disabled={!canGoNext}
                onClick={() => nextVideo && navigate(`/subjects/${subjectId}/video/${nextVideo.id}`)}
                className="gap-1.5"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
