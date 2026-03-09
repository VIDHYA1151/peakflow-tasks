import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ListTodo, Users, FolderKanban, AlertTriangle,
  BarChart3, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Task Management', path: '/admin/tasks', icon: ListTodo },
  { label: 'Team Management', path: '/admin/teams', icon: FolderKanban },
  { label: 'User Management', path: '/admin/users', icon: Users },
  { label: 'Escalation Monitor', path: '/admin/escalation', icon: AlertTriangle },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

const managerNav: NavItem[] = [
  { label: 'Dashboard', path: '/manager', icon: LayoutDashboard },
  { label: 'Team Tasks', path: '/manager/tasks', icon: ListTodo },
  { label: 'Escalation Tracking', path: '/manager/escalation', icon: AlertTriangle },
];

const employeeNav: NavItem[] = [
  { label: 'My Tasks', path: '/employee', icon: ListTodo },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const navItems = user.role === 'admin' ? adminNav : user.role === 'manager' ? managerNav : employeeNav;
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-fg))] flex flex-col transition-all duration-200 ${collapsed ? 'w-16' : 'w-[var(--sidebar-width)]'}`}
      >
        <div className={`h-[var(--header-height)] flex items-center border-b border-[hsl(var(--sidebar-border))] ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
          {!collapsed && <span className="text-lg font-semibold text-[hsl(var(--sidebar-active-fg))]">TaskEscalate</span>}
        </div>

        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-[hsl(var(--sidebar-active))] text-[hsl(var(--sidebar-active-fg))]'
                    : 'hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))]'
                } ${collapsed ? 'justify-center px-2' : ''}`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-1.5 hover:bg-[hsl(var(--sidebar-hover))] rounded text-xs"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-[var(--header-height)] bg-card border-b flex items-center justify-between px-6 shrink-0">
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{roleLabel} Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
};
