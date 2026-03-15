import axios from "axios";
import { mockSubjects, mockProgress, type Subject, type VideoProgress } from "./mockData";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach auth token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export async function loginApi(email: string, password: string) {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  } catch {
    // Mock fallback
    return {
      token: "mock-jwt-token",
      user: { id: "user-1", name: "John Doe", email },
    };
  }
}

export async function registerApi(name: string, email: string, password: string) {
  try {
    const res = await apiClient.post("/auth/register", { name, email, password });
    return res.data;
  } catch {
    return {
      token: "mock-jwt-token",
      user: { id: "user-1", name, email },
    };
  }
}

// ---- Subjects ----
export async function getSubjects(): Promise<Subject[]> {
  try {
    const res = await apiClient.get("/subjects");
    return res.data;
  } catch {
    return mockSubjects;
  }
}

export async function getSubjectTree(subjectId: string): Promise<Subject | undefined> {
  try {
    const res = await apiClient.get(`/subjects/${subjectId}/tree`);
    return res.data;
  } catch {
    return mockSubjects.find((s) => s.id === subjectId);
  }
}

// ---- Videos ----
export async function getVideo(videoId: string) {
  try {
    const res = await apiClient.get(`/videos/${videoId}`);
    return res.data;
  } catch {
    for (const subject of mockSubjects) {
      for (const section of subject.sections) {
        const video = section.videos.find((v) => v.id === videoId);
        if (video) return video;
      }
    }
    return null;
  }
}

// ---- Progress ----
export async function getProgress(): Promise<Record<string, VideoProgress>> {
  try {
    const res = await apiClient.get("/progress");
    return res.data;
  } catch {
    return mockProgress;
  }
}

export async function updateProgress(videoId: string, data: { timestamp: number; completed: boolean }) {
  try {
    const res = await apiClient.post(`/progress/videos/${videoId}`, data);
    return res.data;
  } catch {
    return { success: true };
  }
}

// ---- Enrollments ----
export async function enroll(subjectId: string) {
  try {
    const res = await apiClient.post("/enrollments", { subjectId });
    return res.data;
  } catch {
    return { success: true };
  }
}

export async function getMyEnrollments(): Promise<any[]> {
  try {
    const res = await apiClient.get("/enrollments/my");
    return res.data;
  } catch {
    return [];
  }
}

export default apiClient;
