'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Library, ClipboardList, Brain, BarChart3,
  ShoppingBag, User, Settings, LogOut, X, Bot, GraduationCap
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

const navItems = [
  { group: 'Main', items: [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/courses', icon: BookOpen, label: 'Courses' },
    { href: '/my-courses', icon: Library, label: 'My Courses' },
  ]},
  { group: 'Learning', items: [
    { href: '/assignments', icon: ClipboardList, label: 'Assignments' },
    { href: '/quiz', icon: Brain, label: 'Quiz / Practice' },
    { href: '/progress', icon: BarChart3, label: 'Progress' },
    { href: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
  ]},
  { group: 'Account', items: [
    { href: '/orders', icon: ShoppingBag, label: 'Orders' },
    { href: '/profile', icon: User, label: 'Profile' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]},
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0,2)
    : 'LF';

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`mobile-sidebar-overlay ${mobileOpen ? 'show' : ''}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <GraduationCap size={20} />
          </div>
          <span className="sidebar-brand-name">LearnFlow</span>
          <button
            onClick={onClose}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
            className="md-hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((group) => (
            <div key={group.group}>
              <div className="sidebar-section-label">{group.group}</div>
              {group.items.map(({ href, icon: Icon, label }) => {
                const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`sidebar-link ${active ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <Icon size={17} />
                    {label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer user area */}
        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={handleLogout} title="Logout">
            <div className="avatar">{initials}</div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name || 'Student'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Logout</div>
            </div>
            <LogOut size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          </div>
        </div>
      </aside>
    </>
  );
}
