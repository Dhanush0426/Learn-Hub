import { useSidebarStore } from "@/store/sidebarStore";
import { useNavigate, useParams } from "react-router-dom";
import { SectionItem } from "./SectionItem";
import { ProgressBar } from "./ProgressBar";
import { ArrowLeft } from "lucide-react";

export function SubjectSidebar() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subject, progress, activeVideoId } = useSidebarStore();

  if (!subject) return null;

  // Flatten all video IDs in order to determine unlock status
  const allVideoIds: string[] = [];
  for (const section of subject.sections) {
    for (const video of section.videos) {
      allVideoIds.push(video.id);
    }
  }

  const isVideoUnlocked = (videoId: string) => {
    const index = allVideoIds.indexOf(videoId);
    if (index === 0) return true; // First video always unlocked
    const prevId = allVideoIds[index - 1];
    return !!progress[prevId]?.completed;
  };

  const completedCount = allVideoIds.filter((id) => progress[id]?.completed).length;
  const progressPercent = allVideoIds.length > 0 ? (completedCount / allVideoIds.length) * 100 : 0;

  const handleVideoClick = (videoId: string) => {
    if (isVideoUnlocked(videoId)) {
      navigate(`/subjects/${subjectId}/video/${videoId}`);
    }
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="border-b border-sidebar-border p-4">
        <button
          onClick={() => navigate("/subjects")}
          className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          All Subjects
        </button>
        <h2 className="font-semibold text-sm text-sidebar-foreground line-clamp-2">{subject.title}</h2>
        <div className="mt-3">
          <ProgressBar value={progressPercent} showLabel />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {subject.sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
            progress={progress}
            activeVideoId={activeVideoId}
            isVideoUnlocked={isVideoUnlocked}
            onVideoClick={handleVideoClick}
          />
        ))}
      </div>
    </div>
  );
}
