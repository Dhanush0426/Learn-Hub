import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, getProgress } from "@/lib/apiClient";
import { useAuthStore } from "@/store/authStore";
import { SubjectCard } from "@/components/SubjectCard";
import type { Subject, VideoProgress } from "@/lib/mockData";
import { GraduationCap, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [progress, setProgress] = useState<Record<string, VideoProgress>>({});
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    import("@/lib/apiClient").then(({ getMyEnrollments }) => {
      Promise.all([getSubjects(), getProgress(), getMyEnrollments()]).then(([subs, prog, enrs]) => {
        setSubjects(subs);
        setProgress(prog);
        setEnrollments(enrs);
        setLoading(false);
      });
    });
  }, []);

  const getSubjectProgress = (subject: Subject) => {
    const allVideoIds = subject.sections.flatMap((s) => s.videos.map((v) => v.id));
    if (allVideoIds.length === 0) return 0;
    const completed = allVideoIds.filter((id) => progress[id]?.completed).length;
    return (completed / allVideoIds.length) * 100;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span className="font-semibold text-foreground">LearnHub</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Courses</h1>
          <p className="mt-1 text-muted-foreground">Continue where you left off</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((subject) => (
              <SubjectCard 
                key={subject.id} 
                subject={subject} 
                progressPercent={getSubjectProgress(subject)} 
                isEnrolled={enrollments.some(e => e.subject_id === subject.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
