export type UserRole = 'admin' | 'manager' | 'employee';

export type TaskStatus = 'To Do' | 'Ideating' | 'Testing' | 'In Review' | 'Concepting' | 'Launched';

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type EscalationLevel = 0 | 1 | 2;

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  team: string;
  createdAt: string;
}

export interface Task {
  id: string;
  taskId: string;
  summary: string;
  status: TaskStatus;
  assignee: string;
  priority: TaskPriority;
  dueDate: string;
  createdBy: string;
  teamName: string;
  escalationLevel: EscalationLevel;
  createdAt: string;
  updatedAt: string;
  comments: TaskComment[];
}

export interface TaskComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Team {
  id: string;
  teamName: string;
  manager: string;
  members: string[];
  createdAt: string;
}
