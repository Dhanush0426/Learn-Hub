'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { getMe } from '@/lib/api';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/courses': 'Browse Courses',
  '/my-courses': 'My Courses',
  '/assignments': 'Assignments',
  '/quiz': 'Quiz & Practice',
  '/progress': 'My Progress',
  '/orders': 'Order History',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/ai-assistant': 'AI Learning Assistant',
};

function getTitle(pathname: string): string {
  if (pathname.startsWith('/learn')) return 'Now Learning';
  if (pathname.startsWith('/courses/')) return 'Course Details';
  return PAGE_TITLES[pathname] || 'LearnFlow';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, setUser } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data);
    } catch {
      // getMe will trigger 401 interceptor → redirect to /login
    }
  }, [setUser]);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    loadUser().finally(() => setLoading(false));
  }, [token, router, loadUser]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 22, color: 'white', fontWeight: 800 }}>L</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading LearnFlow…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <Topbar title={getTitle(pathname)} onMenuClick={() => setMobileOpen(true)} />
        <main>
          {children}
        </main>
      </div>
    </div>
  );
}
