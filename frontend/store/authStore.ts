import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  enrolledCourses?: number;
  completedLessons?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  darkMode: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  toggleDarkMode: () => void;
  setDarkMode: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      darkMode: false,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem('auth_token', token);
          } else {
            localStorage.removeItem('auth_token');
          }
        }
        set({ token });
      },
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setDarkMode: (v) => set({ darkMode: v }),
      logout: () => {
        if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'lms-auth',
      partialize: (s) => ({ user: s.user, token: s.token, darkMode: s.darkMode }),
    }
  )
);
