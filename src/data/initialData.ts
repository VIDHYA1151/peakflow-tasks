import { User, Task, Team } from '@/types';

export const initialUsers: User[] = [
  {
    id: 'u1',
    name: 'Admin User',
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    team: '',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'u2',
    name: 'Manager User',
    email: 'manager@gmail.com',
    password: 'manager123',
    role: 'manager',
    team: 'Engineering',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'u3',
    name: 'Employee User',
    email: 'employee@gmail.com',
    password: 'employee123',
    role: 'employee',
    team: 'Engineering',
    createdAt: '2025-01-01T00:00:00Z',
  },
];

export const initialTeams: Team[] = [
  {
    id: 't1',
    teamName: 'Engineering',
    manager: 'u2',
    members: ['u3'],
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 't2',
    teamName: 'Design',
    manager: '',
    members: [],
    createdAt: '2025-01-15T00:00:00Z',
  },
];

const today = new Date();
const pastDate = new Date(today);
pastDate.setDate(pastDate.getDate() - 3);
const futureDate = new Date(today);
futureDate.setDate(futureDate.getDate() + 5);
const farFuture = new Date(today);
farFuture.setDate(farFuture.getDate() + 14);

export const initialTasks: Task[] = [
  {
    id: 'task1',
    taskId: 'TSK-001',
    summary: 'Implement user authentication module',
    status: 'In Review',
    assignee: 'u3',
    priority: 'High',
    dueDate: futureDate.toISOString(),
    createdBy: 'u2',
    teamName: 'Engineering',
    escalationLevel: 0,
    createdAt: '2025-02-01T00:00:00Z',
    updatedAt: '2025-02-10T00:00:00Z',
    comments: [],
  },
  {
    id: 'task2',
    taskId: 'TSK-002',
    summary: 'Design landing page wireframes',
    status: 'To Do',
    assignee: 'u3',
    priority: 'Medium',
    dueDate: pastDate.toISOString(),
    createdBy: 'u1',
    teamName: 'Engineering',
    escalationLevel: 1,
    createdAt: '2025-02-05T00:00:00Z',
    updatedAt: '2025-02-05T00:00:00Z',
    comments: [],
  },
  {
    id: 'task3',
    taskId: 'TSK-003',
    summary: 'Set up CI/CD pipeline',
    status: 'Ideating',
    assignee: 'u3',
    priority: 'Critical',
    dueDate: farFuture.toISOString(),
    createdBy: 'u2',
    teamName: 'Engineering',
    escalationLevel: 0,
    createdAt: '2025-02-08T00:00:00Z',
    updatedAt: '2025-02-12T00:00:00Z',
    comments: [],
  },
  {
    id: 'task4',
    taskId: 'TSK-004',
    summary: 'Database schema optimization',
    status: 'Testing',
    assignee: 'u2',
    priority: 'High',
    dueDate: pastDate.toISOString(),
    createdBy: 'u1',
    teamName: 'Engineering',
    escalationLevel: 2,
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-02-15T00:00:00Z',
    comments: [],
  },
  {
    id: 'task5',
    taskId: 'TSK-005',
    summary: 'Write API documentation',
    status: 'Launched',
    assignee: 'u3',
    priority: 'Low',
    dueDate: futureDate.toISOString(),
    createdBy: 'u2',
    teamName: 'Engineering',
    escalationLevel: 0,
    createdAt: '2025-02-10T00:00:00Z',
    updatedAt: '2025-02-18T00:00:00Z',
    comments: [],
  },
];
