import { create } from 'zustand';

export interface VideoProgress {
  videoId: string;
  completed: boolean;
  timestamp: number;
}

interface ProgressState {
  progress: Record<string, VideoProgress>;
  setProgress: (progress: Record<string, VideoProgress>) => void;
  updateVideoProgress: (videoId: string, data: Partial<VideoProgress>) => void;
}

export const useProgressStore = create<ProgressState>((set) => ({
  progress: {},
  setProgress: (progress) => set({ progress }),
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
}));
