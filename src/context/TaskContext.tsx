import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, Team, TaskStatus, TaskPriority, EscalationLevel, TaskComment } from '@/types';
import { initialTasks, initialTeams } from '@/data/initialData';

interface TaskContextType {
  tasks: Task[];
  teams: Team[];
  addTask: (task: Omit<Task, 'id' | 'taskId' | 'createdAt' | 'updatedAt' | 'comments'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addComment: (taskId: string, comment: Omit<TaskComment, 'id' | 'createdAt'>) => void;
  addTeam: (team: Omit<Team, 'id' | 'createdAt'>) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  getTasksByTeam: (teamName: string) => Task[];
  getTasksByAssignee: (userId: string) => Task[];
  getOverdueTasks: () => Task[];
  runEscalation: () => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

export const useTaskContext = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTaskContext must be used within TaskProvider');
  return ctx;
};

let taskCounter = 6;

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tes_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem('tes_teams');
    return saved ? JSON.parse(saved) : initialTeams;
  });

  useEffect(() => { localStorage.setItem('tes_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('tes_teams', JSON.stringify(teams)); }, [teams]);

  // Run escalation logic on mount and periodically
  const runEscalation = useCallback(() => {
    const now = new Date();
    setTasks(prev => prev.map(task => {
      if (task.status === 'Launched') return task;
      const due = new Date(task.dueDate);
      if (due < now && task.escalationLevel === 0) {
        return { ...task, escalationLevel: 1 as EscalationLevel, updatedAt: now.toISOString() };
      }
      if (due < now && task.escalationLevel === 1) {
        const overdueDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        if (overdueDays >= 2) {
          return { ...task, escalationLevel: 2 as EscalationLevel, updatedAt: now.toISOString() };
        }
      }
      return task;
    }));
  }, []);

  useEffect(() => {
    runEscalation();
    const interval = setInterval(runEscalation, 60000);
    return () => clearInterval(interval);
  }, [runEscalation]);

  const addTask = useCallback((data: Omit<Task, 'id' | 'taskId' | 'createdAt' | 'updatedAt' | 'comments'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...data,
      id: `task${Date.now()}`,
      taskId: `TSK-${String(taskCounter++).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now,
      comments: [],
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const addComment = useCallback((taskId: string, comment: Omit<TaskComment, 'id' | 'createdAt'>) => {
    const newComment: TaskComment = { ...comment, id: `c${Date.now()}`, createdAt: new Date().toISOString() };
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, comments: [...t.comments, newComment], updatedAt: new Date().toISOString() } : t));
  }, []);

  const addTeam = useCallback((data: Omit<Team, 'id' | 'createdAt'>) => {
    const newTeam: Team = { ...data, id: `t${Date.now()}`, createdAt: new Date().toISOString() };
    setTeams(prev => [...prev, newTeam]);
  }, []);

  const updateTeam = useCallback((id: string, updates: Partial<Team>) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTeam = useCallback((id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  }, []);

  const getTasksByTeam = useCallback((teamName: string) => tasks.filter(t => t.teamName === teamName), [tasks]);
  const getTasksByAssignee = useCallback((userId: string) => tasks.filter(t => t.assignee === userId), [tasks]);
  const getOverdueTasks = useCallback(() => {
    const now = new Date();
    return tasks.filter(t => new Date(t.dueDate) < now && t.status !== 'Launched');
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks, teams, addTask, updateTask, deleteTask, addComment,
      addTeam, updateTeam, deleteTeam, getTasksByTeam, getTasksByAssignee, getOverdueTasks, runEscalation,
    }}>
      {children}
    </TaskContext.Provider>
  );
};
