export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  duration: number; // seconds
  order: number;
}

export interface Section {
  id: string;
  title: string;
  order: number;
  videos: Video[];
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  sections: Section[];
}

export interface VideoProgress {
  videoId: string;
  completed: boolean;
  timestamp: number; // seconds
}

export const mockSubjects: Subject[] = [
  {
    id: "sub-1",
    title: "Introduction to Web Development",
    description: "Learn HTML, CSS, and JavaScript fundamentals to build modern websites.",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop",
    sections: [
      {
        id: "sec-1-1",
        title: "Getting Started with HTML",
        order: 1,
        videos: [
          { id: "v-1-1-1", title: "What is HTML?", youtubeId: "qz0aGYrrlhU", duration: 540, order: 1 },
          { id: "v-1-1-2", title: "HTML Document Structure", youtubeId: "qz0aGYrrlhU", duration: 720, order: 2 },
          { id: "v-1-1-3", title: "Working with Tags", youtubeId: "qz0aGYrrlhU", duration: 660, order: 3 },
        ],
      },
      {
        id: "sec-1-2",
        title: "CSS Fundamentals",
        order: 2,
        videos: [
          { id: "v-1-2-1", title: "Introduction to CSS", youtubeId: "qz0aGYrrlhU", duration: 480, order: 1 },
          { id: "v-1-2-2", title: "Selectors & Properties", youtubeId: "qz0aGYrrlhU", duration: 900, order: 2 },
          { id: "v-1-2-3", title: "Flexbox Layout", youtubeId: "qz0aGYrrlhU", duration: 780, order: 3 },
        ],
      },
    ],
  },
  {
    id: "sub-2",
    title: "Data Structures & Algorithms",
    description: "Master essential data structures and algorithmic thinking for technical interviews.",
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=400&h=225&fit=crop",
    sections: [
      {
        id: "sec-2-1",
        title: "Arrays & Strings",
        order: 1,
        videos: [
          { id: "v-2-1-1", title: "Array Basics", youtubeId: "qz0aGYrrlhU", duration: 600, order: 1 },
          { id: "v-2-1-2", title: "String Manipulation", youtubeId: "qz0aGYrrlhU", duration: 540, order: 2 },
        ],
      },
      {
        id: "sec-2-2",
        title: "Linked Lists",
        order: 2,
        videos: [
          { id: "v-2-2-1", title: "Singly Linked Lists", youtubeId: "qz0aGYrrlhU", duration: 720, order: 1 },
          { id: "v-2-2-2", title: "Doubly Linked Lists", youtubeId: "qz0aGYrrlhU", duration: 660, order: 2 },
          { id: "v-2-2-3", title: "Common Interview Problems", youtubeId: "qz0aGYrrlhU", duration: 900, order: 3 },
        ],
      },
    ],
  },
  {
    id: "sub-3",
    title: "React & Modern Frontend",
    description: "Build interactive UIs with React, hooks, state management, and modern tooling.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop",
    sections: [
      {
        id: "sec-3-1",
        title: "React Basics",
        order: 1,
        videos: [
          { id: "v-3-1-1", title: "Components & JSX", youtubeId: "qz0aGYrrlhU", duration: 600, order: 1 },
          { id: "v-3-1-2", title: "Props & State", youtubeId: "qz0aGYrrlhU", duration: 720, order: 2 },
          { id: "v-3-1-3", title: "Event Handling", youtubeId: "qz0aGYrrlhU", duration: 540, order: 3 },
        ],
      },
      {
        id: "sec-3-2",
        title: "Advanced Hooks",
        order: 2,
        videos: [
          { id: "v-3-2-1", title: "useEffect Deep Dive", youtubeId: "qz0aGYrrlhU", duration: 840, order: 1 },
          { id: "v-3-2-2", title: "Custom Hooks", youtubeId: "qz0aGYrrlhU", duration: 660, order: 2 },
        ],
      },
    ],
  },
];

// First video of each subject is unlocked, rest are locked until previous is completed
export const mockProgress: Record<string, VideoProgress> = {
  "v-1-1-1": { videoId: "v-1-1-1", completed: true, timestamp: 540 },
  "v-1-1-2": { videoId: "v-1-1-2", completed: true, timestamp: 720 },
  "v-1-1-3": { videoId: "v-1-1-3", completed: false, timestamp: 180 },
  "v-2-1-1": { videoId: "v-2-1-1", completed: true, timestamp: 600 },
  "v-2-1-2": { videoId: "v-2-1-2", completed: false, timestamp: 0 },
  "v-3-1-1": { videoId: "v-3-1-1", completed: false, timestamp: 120 },
};
