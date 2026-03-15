import { cn } from "@/lib/utils";
import { CheckCircle2, Lock, Play } from "lucide-react";

interface VideoItemProps {
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  duration: number;
  onClick: () => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function VideoItem({ title, isActive, isCompleted, isLocked, duration, onClick }: VideoItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLocked}
      className={cn(
        "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
        !isActive && !isLocked && "hover:bg-muted/50 text-foreground",
        isLocked && "cursor-not-allowed opacity-50 text-locked"
      )}
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center">
        {isCompleted ? (
          <CheckCircle2 className="h-4 w-4 text-success" />
        ) : isLocked ? (
          <Lock className="h-3.5 w-3.5" />
        ) : isActive ? (
          <Play className="h-3.5 w-3.5 fill-current" />
        ) : (
          <Play className="h-3.5 w-3.5" />
        )}
      </span>
      <span className="flex-1 truncate">{title}</span>
      <span className="shrink-0 text-xs text-muted-foreground">{formatDuration(duration)}</span>
    </button>
  );
}
