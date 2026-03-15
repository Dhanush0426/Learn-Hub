'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { darkMode } = useAuthStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return <>{children}</>;
}
