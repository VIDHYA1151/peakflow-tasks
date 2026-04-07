import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project, Escalation, Notification, ActivityItem } from '@/types';
import { initialProjects, initialEscalations, initialNotifications, initialActivities } from '@/data/initialData';

interface ProjectContextType {
  projects: Project[];
  escalations: Escalation[];
  notifications: Notification[];
  activities: ActivityItem[];
  addProject: (data: Omit<Project, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addEscalation: (data: Omit<Escalation, 'id'>) => void;
  updateEscalation: (id: string, data: Partial<Escalation>) => void;
  addNotification: (data: Omit<Notification, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addActivity: (data: Omit<ActivityItem, 'id'>) => void;
  addProjectComment: (projectId: string, comment: { userId: string; userName: string; text: string }) => void;
  getProjectsByManager: (managerId: string) => Project[];
  getProjectsByEmployee: (employeeId: string) => Project[];
  getNotificationsByUser: (userId: string) => Notification[];
  getUnreadCount: (userId: string) => number;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const useProjectContext = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectContext must be used within ProjectProvider');
  return ctx;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pems_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });
  const [escalations, setEscalations] = useState<Escalation[]>(() => {
    const saved = localStorage.getItem('pems_escalations');
    return saved ? JSON.parse(saved) : initialEscalations;
  });
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('pems_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('pems_activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  useEffect(() => { localStorage.setItem('pems_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('pems_escalations', JSON.stringify(escalations)); }, [escalations]);
  useEffect(() => { localStorage.setItem('pems_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('pems_activities', JSON.stringify(activities)); }, [activities]);

  // Auto-escalation logic
  useEffect(() => {
    const now = new Date();
    setProjects(prev => prev.map(p => {
      if (p.status === 'Completed') return p;
      const deadline = new Date(p.deadline);
      if (deadline < now && p.progress < 100) {
        if (p.status !== 'Overdue' && p.status !== 'Escalated') {
          return { ...p, status: 'Overdue' as const, updatedAt: now.toISOString() };
        }
      }
      return p;
    }));
  }, []);

  const addProject = useCallback((data: Omit<Project, 'id' | 'projectId' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const now = new Date().toISOString();
    setProjects(prev => {
      const num = prev.length + 1;
      return [...prev, { ...data, id: `p${Date.now()}`, projectId: `PRJ-${String(num).padStart(3, '0')}`, createdAt: now, updatedAt: now, comments: [] }];
    });
  }, []);

  const updateProject = useCallback((id: string, data: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const addEscalation = useCallback((data: Omit<Escalation, 'id'>) => {
    setEscalations(prev => [...prev, { ...data, id: `e${Date.now()}` }]);
  }, []);

  const updateEscalation = useCallback((id: string, data: Partial<Escalation>) => {
    setEscalations(prev => prev.map(e => e.id === id ? { ...e, ...data } : e));
  }, []);

  const addNotification = useCallback((data: Omit<Notification, 'id'>) => {
    setNotifications(prev => [{ ...data, id: `n${Date.now()}` }, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback((userId: string) => {
    setNotifications(prev => prev.map(n => n.userId === userId ? { ...n, read: true } : n));
  }, []);

  const addActivity = useCallback((data: Omit<ActivityItem, 'id'>) => {
    setActivities(prev => [{ ...data, id: `a${Date.now()}` }, ...prev]);
  }, []);

  const addProjectComment = useCallback((projectId: string, comment: { userId: string; userName: string; text: string }) => {
    setProjects(prev => prev.map(p => p.id === projectId ? {
      ...p, comments: [...p.comments, { ...comment, id: `c${Date.now()}`, createdAt: new Date().toISOString() }], updatedAt: new Date().toISOString()
    } : p));
  }, []);

  const getProjectsByManager = useCallback((managerId: string) => projects.filter(p => p.managerId === managerId), [projects]);
  const getProjectsByEmployee = useCallback((employeeId: string) => projects.filter(p => p.teamMembers.includes(employeeId)), [projects]);
  const getNotificationsByUser = useCallback((userId: string) => notifications.filter(n => n.userId === userId), [notifications]);
  const getUnreadCount = useCallback((userId: string) => notifications.filter(n => n.userId === userId && !n.read).length, [notifications]);

  return (
    <ProjectContext.Provider value={{
      projects, escalations, notifications, activities,
      addProject, updateProject, deleteProject,
      addEscalation, updateEscalation,
      addNotification, markNotificationRead, markAllNotificationsRead,
      addActivity, addProjectComment,
      getProjectsByManager, getProjectsByEmployee, getNotificationsByUser, getUnreadCount,
    }}>
      {children}
    </ProjectContext.Provider>
  );
};
