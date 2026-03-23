import apiClient from './apiClient';
import { Subject, Enrollment, Assignment, Quiz } from './courses';

// ─── Auth ──────────────────────────────────────────────
export const loginUser = (email: string, password: string) =>
  apiClient.post('/auth/login', { email, password }).then((r) => r.data);

export const registerUser = (name: string, email: string, password: string) =>
  apiClient.post('/auth/register', { name, email, password }).then((r) => r.data);

// ─── User ──────────────────────────────────────────────
export const getMe = () =>
  apiClient.get('/users/me').then((r) => r.data);

export const updateMe = (name: string) =>
  apiClient.patch('/users/me', { name }).then((r) => r.data);

// ─── Subjects ──────────────────────────────────────────
export const getSubjects = (): Promise<Subject[]> =>
  apiClient.get('/subjects').then((r) => r.data);

export const getSubjectTree = (id: string): Promise<Subject> =>
  apiClient.get(`/subjects/${id}/tree`).then((r) => r.data);

// ─── Enrollments ───────────────────────────────────────
export const enrollInCourse = (subjectId: string) =>
  apiClient.post('/enrollments', { subjectId }).then((r) => r.data);

export const getMyEnrollments = (): Promise<Enrollment[]> =>
  apiClient.get('/enrollments/my').then((r) => r.data);

// ─── Progress ──────────────────────────────────────────
export const getProgress = () =>
  apiClient.get('/progress').then((r) => r.data);

export const updateVideoProgress = (videoId: string, timestamp: number, completed: boolean) =>
  apiClient.post(`/progress/videos/${videoId}`, { timestamp, completed }).then((r) => r.data);

// ─── Assignments ───────────────────────────────────────
export const getAssignments = (): Promise<Assignment[]> =>
  apiClient.get('/assignments').then((r) => r.data);

export const submitAssignment = (assignmentId: string, content: string) =>
  apiClient.post(`/assignments/${assignmentId}/submit`, { content }).then((r) => r.data);

// ─── Quizzes ───────────────────────────────────────────
export const getQuizzes = (): Promise<Quiz[]> =>
  apiClient.get('/quizzes').then((r) => r.data);

export const submitQuizAttempt = (quizId: string, answers: Record<string, number>) =>
  apiClient.post(`/quizzes/${quizId}/attempt`, { answers }).then((r) => r.data);
