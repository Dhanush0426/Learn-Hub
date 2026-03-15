// TypeScript interfaces matching the backend DB schema
export interface Video {
  id: string;
  section_id: string;
  title: string;
  description: string;
  youtube_video_id: string;
  order_index: number;
  duration_seconds: number;
}

export interface Section {
  id: string;
  subject_id: string;
  title: string;
  order_index: number;
  videos: Video[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  slug: string;
  instructor: string;
  price: number;
  is_published: boolean;
  created_at: string;
  sections: Section[];
}

export interface Enrollment {
  id: string;
  user_id: string;
  subject_id: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  subject_id: string;
  subject_title: string;
  title: string;
  description: string;
  due_date: string | null;
  submission_id: string | null;
  submission_content: string | null;
  submitted_at: string | null;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question: string;
  options: string[];
  correct_index: number;
}

export interface Quiz {
  id: string;
  subject_id: string;
  subject_title: string;
  title: string;
  questions: QuizQuestion[];
}

export function getTotalLessons(subject: Subject): number {
  return subject.sections?.reduce((acc, s) => acc + (s.videos?.length || 0), 0) || 0;
}

export function getTotalDuration(subject: Subject): number {
  return subject.sections?.reduce((acc, s) =>
    acc + (s.videos?.reduce((a, v) => a + (v.duration_seconds || 0), 0) || 0), 0
  ) || 0;
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

// Get flat list of all videos in a subject in order
export function getFlatVideos(subject: Subject): Video[] {
  return subject.sections
    ?.sort((a, b) => a.order_index - b.order_index)
    .flatMap((s) => [...(s.videos || [])].sort((a, b) => a.order_index - b.order_index)) || [];
}
