import { create } from 'zustand';
import { Subject } from '@/lib/courses';

interface CourseState {
  catalog: Subject[];
  courseDetail: Subject | null;
  setCatalog: (subjects: Subject[]) => void;
  setCourseDetail: (subject: Subject) => void;
}

export const useCourseStore = create<CourseState>((set) => ({
  catalog: [],
  courseDetail: null,
  setCatalog: (subjects) => set({ catalog: subjects }),
  setCourseDetail: (subject) => set({ courseDetail: subject })
}));
