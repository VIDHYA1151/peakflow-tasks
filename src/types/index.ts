export type UserRole = 'admin' | 'manager' | 'employee';

export type ProjectStatus = 'Pending' | 'Ongoing' | 'Completed' | 'Escalated' | 'Overdue';

export type ProjectPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type EscalationStatus = 'Open' | 'In Review' | 'Resolved' | 'Closed';

export type EscalationLevel = 0 | 1 | 2 | 3;

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department: string;
  createdAt: string;
  status: 'Active' | 'Inactive';
}

export interface Project {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  managerId: string;
  teamMembers: string[];
  priority: ProjectPriority;
  progress: number;
  status: ProjectStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  comments: ProjectComment[];
}

export interface ProjectComment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: string;
}

export interface Escalation {
  id: string;
  projectId: string;
  projectName: string;
  reason: string;
  level: EscalationLevel;
  escalationDate: string;
  escalatedBy: string;
  escalatedTo: string;
  status: EscalationStatus;
  remarks: string;
  resolvedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  details: string;
  userId: string;
  userName: string;
  createdAt: string;
}
