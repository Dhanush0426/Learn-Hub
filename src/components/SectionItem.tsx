import type { Section, VideoProgress } from "@/lib/mockData";
import { VideoItem } from "./VideoItem";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SectionItemProps {
  section: Section;
  progress: Record<string, VideoProgress>;
  activeVideoId: string | null;
  isVideoUnlocked: (videoId: string) => boolean;
  onVideoClick: (videoId: string) => void;
}

export function SectionItem({ section, progress, activeVideoId, isVideoUnlocked, onVideoClick }: SectionItemProps) {
  const [open, setOpen] = useState(true);
  const completedCount = section.videos.filter((v) => progress[v.id]?.completed).length;

  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:bg-muted/50 transition-colors"
      >
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", !open && "-rotate-90")} />
        <span className="flex-1 text-left">{section.title}</span>
        <span className="text-[10px] font-normal">
          {completedCount}/{section.videos.length}
        </span>
      </button>
      {open && (
        <div className="space-y-0.5 pl-2">
          {section.videos.map((video) => (
            <VideoItem
              key={video.id}
              title={video.title}
              duration={video.duration}
              isActive={video.id === activeVideoId}
              isCompleted={!!progress[video.id]?.completed}
              isLocked={!isVideoUnlocked(video.id)}
              onClick={() => onVideoClick(video.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
