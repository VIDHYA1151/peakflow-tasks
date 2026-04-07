import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useProjectContext } from '@/context/ProjectContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, AlertTriangle, Users, UserCog, UsersRound,
  BarChart3, LogOut, ChevronLeft, ChevronRight, Bell, User, Settings,
  Calendar, Shield,
} from 'lucide-react';
import { useState } from 'react';

interface NavItem { label: string; path: string; icon: React.ElementType; }

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Escalations', path: '/admin/escalations', icon: AlertTriangle },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { label: 'Profile', path: '/admin/profile', icon: User },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

const managerNav: NavItem[] = [
  { label: 'Dashboard', path: '/manager', icon: LayoutDashboard },
  { label: 'My Projects', path: '/manager/projects', icon: FolderKanban },
  { label: 'Team Members', path: '/manager/team', icon: UsersRound },
  { label: 'Escalations', path: '/manager/escalations', icon: AlertTriangle },
  { label: 'Reports', path: '/manager/reports', icon: BarChart3 },
  { label: 'Profile', path: '/manager/profile', icon: User },
  { label: 'Settings', path: '/manager/settings', icon: Settings },
];

const employeeNav: NavItem[] = [
  { label: 'Dashboard', path: '/employee', icon: LayoutDashboard },
  { label: 'My Projects', path: '/employee/projects', icon: FolderKanban },
  { label: 'Deadlines', path: '/employee/deadlines', icon: Calendar },
  { label: 'Escalations', path: '/employee/escalations', icon: AlertTriangle },
  { label: 'Profile', path: '/employee/profile', icon: User },
  { label: 'Settings', path: '/employee/settings', icon: Settings },
];

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { getUnreadCount } = useProjectContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  if (!user) { navigate('/login'); return null; }

  const navItems = user.role === 'admin' ? adminNav : user.role === 'manager' ? managerNav : employeeNav;
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);
  const unreadCount = getUnreadCount(user.id);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 260 }}
        transition={{ duration: 0.2 }}
        className="bg-[hsl(var(--sidebar-bg))] text-[hsl(var(--sidebar-fg))] flex flex-col shrink-0"
      >
        <div className={`h-14 flex items-center border-b border-[hsl(var(--sidebar-border))] ${collapsed ? 'justify-center px-2' : 'px-5'}`}>
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold text-[hsl(var(--sidebar-active-fg))]">PEMS</span>
            </div>
          )}
          {collapsed && <Shield className="h-5 w-5 text-primary" />}
        </div>

        <nav className="flex-1 py-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-150 ${
                  active
                    ? 'bg-primary/20 text-[hsl(var(--sidebar-active-fg))] border-r-2 border-primary'
                    : 'hover:bg-[hsl(var(--sidebar-hover))] text-[hsl(var(--sidebar-fg))]'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-[hsl(var(--sidebar-border))] p-2">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[hsl(var(--sidebar-fg))] hover:bg-[hsl(var(--sidebar-hover))] transition-colors rounded ${collapsed ? 'justify-center px-2' : ''}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center py-1.5 hover:bg-[hsl(var(--sidebar-hover))] rounded text-xs mt-1"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </motion.aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-card border-b flex items-center justify-between px-6 shrink-0">
          <div className="text-sm">
            <span className="font-semibold text-foreground">{roleLabel} Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary">{user.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Notification dropdown */}
        {notifOpen && <NotificationDropdown userId={user.id} onClose={() => setNotifOpen(false)} />}

        <main className="flex-1 overflow-y-auto p-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const NotificationDropdown: React.FC<{ userId: string; onClose: () => void }> = ({ userId, onClose }) => {
  const { getNotificationsByUser, markNotificationRead, markAllNotificationsRead } = useProjectContext();
  const notifs = getNotificationsByUser(userId).slice(0, 8);

  const typeColors = { info: 'bg-info/10 text-info', warning: 'bg-warning/10 text-warning', success: 'bg-success/10 text-success', error: 'bg-destructive/10 text-destructive' };

  return (
    <div className="absolute right-6 top-14 z-50 w-80 bg-card border rounded-lg shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-sm font-semibold">Notifications</h3>
        <button onClick={() => { markAllNotificationsRead(userId); }} className="text-xs text-primary hover:underline">Mark all read</button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifs.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 text-center">No notifications</p>
        ) : notifs.map(n => (
          <button key={n.id} onClick={() => markNotificationRead(n.id)} className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-muted/50 transition-colors ${!n.read ? 'bg-primary/5' : ''}`}>
            <div className="flex items-start gap-2">
              <span className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
              <div>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="px-4 py-2 border-t">
        <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground w-full text-center">Close</button>
      </div>
    </div>
  );
};
