import { create } from "zustand";
import type { Subject, VideoProgress } from "@/lib/mockData";
import { getSubjectTree, getProgress } from "@/lib/apiClient";

interface SidebarState {
  subject: Subject | null;
  progress: Record<string, VideoProgress>;
  activeVideoId: string | null;
  isLoading: boolean;
  loadSubject: (subjectId: string) => Promise<void>;
  setActiveVideo: (videoId: string) => void;
  updateVideoProgress: (videoId: string, data: Partial<VideoProgress>) => void;
  getAllVideosFlat: () => { id: string; title: string; sectionTitle: string; order: number; globalIndex: number }[];
}

export const useSidebarStore = create<SidebarState>((set, get) => ({
  subject: null,
  progress: {},
  activeVideoId: null,
  isLoading: false,

  loadSubject: async (subjectId) => {
    set({ isLoading: true });
    const [subject, progress] = await Promise.all([getSubjectTree(subjectId), getProgress()]);
    set({ subject: subject || null, progress, isLoading: false });
  },

  setActiveVideo: (videoId) => set({ activeVideoId: videoId }),

  updateVideoProgress: (videoId, data) =>
    set((state) => ({
      progress: {
        ...state.progress,
        [videoId]: {
          videoId,
          completed: state.progress[videoId]?.completed || false,
          timestamp: state.progress[videoId]?.timestamp || 0,
          ...data,
        },
      },
    })),

  getAllVideosFlat: () => {
    const subject = get().subject;
    if (!subject) return [];
    let globalIndex = 0;
    const flat: { id: string; title: string; sectionTitle: string; order: number; globalIndex: number }[] = [];
    for (const section of subject.sections) {
      for (const video of section.videos) {
        flat.push({
          id: video.id,
          title: video.title,
          sectionTitle: section.title,
          order: video.order,
          globalIndex: globalIndex++,
        });
      }
    }
    return flat;
  },
}));
