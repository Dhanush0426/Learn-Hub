import { useNavigate } from "react-router-dom";
import type { Subject } from "@/lib/mockData";
import { ProgressBar } from "./ProgressBar";
import { BookOpen } from "lucide-react";

import { enroll } from "@/lib/apiClient";
import { toast } from "sonner";
import { useState } from "react";

interface SubjectCardProps {
  subject: Subject;
  progressPercent: number;
  isEnrolled?: boolean;
}

export function SubjectCard({ subject, progressPercent, isEnrolled: initialEnrolled }: SubjectCardProps) {
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolled);
  const [enrolling, setEnrolling] = useState(false);
  
  // Safe default if subject.sections is not available
  const totalVideos = subject.sections ? subject.sections.reduce((sum, s) => sum + s.videos?.length || 0, 0) : 0;

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setEnrolling(true);
      await enroll(subject.id);
      setIsEnrolled(true);
      toast.success("Successfully enrolled!");
      navigate(`/subjects/${subject.id}`);
    } catch (err) {
      toast.error("Failed to enroll");
    } finally {
      setEnrolling(false);
    }
  };

  const handleCardClick = () => {
    if (isEnrolled) {
      navigate(`/subjects/${subject.id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-left shadow-sm transition-all hover:shadow-md ${isEnrolled ? "cursor-pointer hover:border-primary/30" : "cursor-default"}`}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={subject.thumbnail}
          alt={subject.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-semibold text-card-foreground line-clamp-2">{subject.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{subject.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{totalVideos} lessons</span>
          </div>
          {!isEnrolled && (
            <button 
              onClick={handleEnroll}
              disabled={enrolling}
              className="bg-primary hover:bg-primary/90 text-primary-foreground focus:ring-4 focus:outline-none focus:ring-primary/30 font-medium rounded-lg text-xs px-4 py-1.5 text-center transition-colors"
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
          )}
        </div>
        {isEnrolled && <ProgressBar value={progressPercent} showLabel />}
      </div>
    </div>
  );
}
