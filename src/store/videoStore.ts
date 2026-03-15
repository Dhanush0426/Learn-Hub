import { create } from "zustand";
import type { Video } from "@/lib/mockData";

interface VideoState {
  currentVideo: Video | null;
  timestamp: number;
  isCompleted: boolean;
  setCurrentVideo: (video: Video, timestamp?: number) => void;
  setTimestamp: (t: number) => void;
  markCompleted: () => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  currentVideo: null,
  timestamp: 0,
  isCompleted: false,

  setCurrentVideo: (video, timestamp = 0) =>
    set({ currentVideo: video, timestamp, isCompleted: false }),

  setTimestamp: (t) => set({ timestamp: t }),

  markCompleted: () => set({ isCompleted: true }),

  reset: () => set({ currentVideo: null, timestamp: 0, isCompleted: false }),
}));
