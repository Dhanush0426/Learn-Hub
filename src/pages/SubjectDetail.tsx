import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSidebarStore } from "@/store/sidebarStore";
import { SectionItem } from "@/components/SectionItem";
import { ProgressBar } from "@/components/ProgressBar";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const { subject, progress, isLoading, loadSubject } = useSidebarStore();

  useEffect(() => {
    if (subjectId) loadSubject(subjectId);
  }, [subjectId, loadSubject]);

  if (isLoading || !subject) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const allVideoIds = subject.sections.flatMap((s) => s.videos.map((v) => v.id));
  const completedCount = allVideoIds.filter((id) => progress[id]?.completed).length;
  const progressPercent = allVideoIds.length > 0 ? (completedCount / allVideoIds.length) * 100 : 0;

  // Find the first incomplete/unwatched video to resume
  const isVideoUnlocked = (videoId: string) => {
    const index = allVideoIds.indexOf(videoId);
    if (index === 0) return true;
    return !!progress[allVideoIds[index - 1]]?.completed;
  };

  const resumeVideoId = allVideoIds.find((id) => isVideoUnlocked(id) && !progress[id]?.completed) || allVideoIds[0];

  const handleVideoClick = (videoId: string) => {
    if (isVideoUnlocked(videoId)) {
      navigate(`/subjects/${subjectId}/video/${videoId}`);
    } else {
      import("sonner").then(({ toast }) => toast.error("Complete previous lesson to unlock."));
    }
  };

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <button
          onClick={() => navigate("/subjects")}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">{subject.title}</h1>
          <p className="mt-2 text-muted-foreground">{subject.description}</p>
          <div className="mt-4 flex items-center gap-4">
            <ProgressBar value={progressPercent} showLabel className="flex-1 max-w-xs" />
            <span className="text-sm text-muted-foreground">
              {completedCount}/{allVideoIds.length} completed
            </span>
          </div>
          <Button
            className="mt-4 gap-2"
            onClick={() => navigate(`/subjects/${subjectId}/video/${resumeVideoId}`)}
          >
            <Play className="h-4 w-4" />
            {completedCount > 0 ? "Continue Learning" : "Start Course"}
          </Button>
        </div>

        <div className="space-y-2">
          {subject.sections.map((section) => (
            <SectionItem
              key={section.id}
              section={section}
              progress={progress}
              activeVideoId={null}
              isVideoUnlocked={isVideoUnlocked}
              onVideoClick={handleVideoClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
