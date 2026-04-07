import { User, Project, Escalation, Notification, ActivityItem } from '@/types';

const today = new Date();
const d = (offset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + offset);
  return dt.toISOString();
};

export const initialUsers: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'admin@gmail.com', password: 'admin123', role: 'admin', department: 'Administration', createdAt: '2025-01-01T00:00:00Z', status: 'Active' },
  { id: 'u2', name: 'Priya Sharma', email: 'manager@gmail.com', password: 'manager123', role: 'manager', department: 'Engineering', createdAt: '2025-01-05T00:00:00Z', status: 'Active' },
  { id: 'u3', name: 'Amit Patel', email: 'manager2@gmail.com', password: 'manager123', role: 'manager', department: 'Design', createdAt: '2025-01-08T00:00:00Z', status: 'Active' },
  { id: 'u4', name: 'Sneha Reddy', email: 'manager3@gmail.com', password: 'manager123', role: 'manager', department: 'Marketing', createdAt: '2025-01-10T00:00:00Z', status: 'Active' },
  { id: 'u5', name: 'Vikram Singh', email: 'employee@gmail.com', password: 'employee123', role: 'employee', department: 'Engineering', createdAt: '2025-01-12T00:00:00Z', status: 'Active' },
  { id: 'u6', name: 'Ananya Gupta', email: 'employee2@gmail.com', password: 'employee123', role: 'employee', department: 'Engineering', createdAt: '2025-01-14T00:00:00Z', status: 'Active' },
  { id: 'u7', name: 'Rohit Joshi', email: 'employee3@gmail.com', password: 'employee123', role: 'employee', department: 'Design', createdAt: '2025-01-16T00:00:00Z', status: 'Active' },
  { id: 'u8', name: 'Kavita Nair', email: 'employee4@gmail.com', password: 'employee123', role: 'employee', department: 'Marketing', createdAt: '2025-01-18T00:00:00Z', status: 'Active' },
  { id: 'u9', name: 'Deepak Verma', email: 'employee5@gmail.com', password: 'employee123', role: 'employee', department: 'Engineering', createdAt: '2025-01-20T00:00:00Z', status: 'Active' },
  { id: 'u10', name: 'Meera Iyer', email: 'employee6@gmail.com', password: 'employee123', role: 'employee', department: 'Design', createdAt: '2025-01-22T00:00:00Z', status: 'Active' },
];

export const initialProjects: Project[] = [
  { id: 'p1', projectId: 'PRJ-001', name: 'E-Commerce Platform Redesign', description: 'Complete redesign of the e-commerce platform with modern UI/UX', startDate: '2025-02-01T00:00:00Z', deadline: d(15), managerId: 'u2', teamMembers: ['u5', 'u6', 'u9'], priority: 'High', progress: 65, status: 'Ongoing', createdBy: 'u1', createdAt: '2025-02-01T00:00:00Z', updatedAt: d(-1), comments: [] },
  { id: 'p2', projectId: 'PRJ-002', name: 'Mobile App Development', description: 'Develop a cross-platform mobile application for customer engagement', startDate: '2025-01-15T00:00:00Z', deadline: d(-3), managerId: 'u2', teamMembers: ['u5', 'u9'], priority: 'Critical', progress: 40, status: 'Escalated', createdBy: 'u1', createdAt: '2025-01-15T00:00:00Z', updatedAt: d(-1), comments: [] },
  { id: 'p3', projectId: 'PRJ-003', name: 'Cloud Infrastructure Migration', description: 'Migrate existing infrastructure to cloud services', startDate: '2025-03-01T00:00:00Z', deadline: d(30), managerId: 'u2', teamMembers: ['u6'], priority: 'High', progress: 20, status: 'Ongoing', createdBy: 'u1', createdAt: '2025-03-01T00:00:00Z', updatedAt: d(-2), comments: [] },
  { id: 'p4', projectId: 'PRJ-004', name: 'Brand Identity Refresh', description: 'Update brand guidelines and visual identity across all platforms', startDate: '2025-02-15T00:00:00Z', deadline: d(7), managerId: 'u3', teamMembers: ['u7', 'u10'], priority: 'Medium', progress: 80, status: 'Ongoing', createdBy: 'u1', createdAt: '2025-02-15T00:00:00Z', updatedAt: d(-1), comments: [] },
  { id: 'p5', projectId: 'PRJ-005', name: 'UI Component Library', description: 'Build a reusable UI component library for internal projects', startDate: '2025-01-10T00:00:00Z', deadline: d(-10), managerId: 'u3', teamMembers: ['u7'], priority: 'Medium', progress: 100, status: 'Completed', createdBy: 'u1', createdAt: '2025-01-10T00:00:00Z', updatedAt: d(-5), comments: [] },
  { id: 'p6', projectId: 'PRJ-006', name: 'Marketing Campaign Q2', description: 'Plan and execute Q2 marketing campaigns', startDate: '2025-03-15T00:00:00Z', deadline: d(45), managerId: 'u4', teamMembers: ['u8'], priority: 'High', progress: 10, status: 'Pending', createdBy: 'u1', createdAt: '2025-03-15T00:00:00Z', updatedAt: d(-3), comments: [] },
  { id: 'p7', projectId: 'PRJ-007', name: 'Customer Portal Development', description: 'Build a self-service customer portal', startDate: '2025-02-10T00:00:00Z', deadline: d(-5), managerId: 'u2', teamMembers: ['u5', 'u6'], priority: 'High', progress: 55, status: 'Overdue', createdBy: 'u1', createdAt: '2025-02-10T00:00:00Z', updatedAt: d(-1), comments: [] },
  { id: 'p8', projectId: 'PRJ-008', name: 'Data Analytics Dashboard', description: 'Create an analytics dashboard for business intelligence', startDate: '2025-01-20T00:00:00Z', deadline: d(-15), managerId: 'u2', teamMembers: ['u9'], priority: 'Medium', progress: 100, status: 'Completed', createdBy: 'u1', createdAt: '2025-01-20T00:00:00Z', updatedAt: d(-10), comments: [] },
  { id: 'p9', projectId: 'PRJ-009', name: 'Social Media Integration', description: 'Integrate social media APIs into the platform', startDate: '2025-03-01T00:00:00Z', deadline: d(20), managerId: 'u4', teamMembers: ['u8'], priority: 'Low', progress: 30, status: 'Ongoing', createdBy: 'u1', createdAt: '2025-03-01T00:00:00Z', updatedAt: d(-2), comments: [] },
  { id: 'p10', projectId: 'PRJ-010', name: 'Security Audit & Compliance', description: 'Conduct security audit and ensure compliance with industry standards', startDate: '2025-02-20T00:00:00Z', deadline: d(10), managerId: 'u3', teamMembers: ['u10'], priority: 'Critical', progress: 45, status: 'Ongoing', createdBy: 'u1', createdAt: '2025-02-20T00:00:00Z', updatedAt: d(-1), comments: [] },
  { id: 'p11', projectId: 'PRJ-011', name: 'API Gateway Setup', description: 'Set up centralized API gateway for microservices', startDate: '2025-03-10T00:00:00Z', deadline: d(25), managerId: 'u2', teamMembers: ['u5'], priority: 'Medium', progress: 0, status: 'Pending', createdBy: 'u1', createdAt: '2025-03-10T00:00:00Z', updatedAt: d(-1), comments: [] },
  { id: 'p12', projectId: 'PRJ-012', name: 'Employee Training Portal', description: 'Build an online training and certification portal', startDate: '2025-04-01T00:00:00Z', deadline: d(-2), managerId: 'u4', teamMembers: ['u8'], priority: 'High', progress: 25, status: 'Escalated', createdBy: 'u1', createdAt: '2025-04-01T00:00:00Z', updatedAt: d(-1), comments: [] },
];

export const initialEscalations: Escalation[] = [
  { id: 'e1', projectId: 'p2', projectName: 'Mobile App Development', reason: 'Deadline missed - critical features incomplete', level: 2, escalationDate: d(-2), escalatedBy: 'u2', escalatedTo: 'u1', status: 'Open', remarks: 'Requires additional resources' },
  { id: 'e2', projectId: 'p12', projectName: 'Employee Training Portal', reason: 'Project blocked due to vendor dependency', level: 1, escalationDate: d(-1), escalatedBy: 'u4', escalatedTo: 'u1', status: 'In Review', remarks: 'Waiting for vendor response' },
];

export const initialNotifications: Notification[] = [
  { id: 'n1', userId: 'u1', title: 'Project Escalated', message: 'Mobile App Development has been escalated to Level 2', type: 'error', read: false, createdAt: d(-2) },
  { id: 'n2', userId: 'u1', title: 'Project Overdue', message: 'Customer Portal Development has passed its deadline', type: 'warning', read: false, createdAt: d(-1) },
  { id: 'n3', userId: 'u2', title: 'New Project Assigned', message: 'API Gateway Setup has been assigned to you', type: 'info', read: false, createdAt: d(-1) },
  { id: 'n4', userId: 'u5', title: 'Deadline Approaching', message: 'E-Commerce Platform Redesign deadline is in 15 days', type: 'warning', read: true, createdAt: d(-3) },
  { id: 'n5', userId: 'u1', title: 'Project Completed', message: 'UI Component Library has been marked as completed', type: 'success', read: true, createdAt: d(-5) },
];

export const initialActivities: ActivityItem[] = [
  { id: 'a1', action: 'Project Escalated', details: 'Mobile App Development escalated to Admin', userId: 'u2', userName: 'Priya Sharma', createdAt: d(-2) },
  { id: 'a2', action: 'Project Completed', details: 'UI Component Library marked as completed', userId: 'u3', userName: 'Amit Patel', createdAt: d(-5) },
  { id: 'a3', action: 'New Project Created', details: 'API Gateway Setup created by Admin', userId: 'u1', userName: 'Rajesh Kumar', createdAt: d(-1) },
  { id: 'a4', action: 'Progress Updated', details: 'E-Commerce Platform Redesign progress updated to 65%', userId: 'u5', userName: 'Vikram Singh', createdAt: d(-1) },
  { id: 'a5', action: 'Project Overdue', details: 'Customer Portal Development passed deadline', userId: 'u1', userName: 'Rajesh Kumar', createdAt: d(-1) },
  { id: 'a6', action: 'New Employee Added', details: 'Meera Iyer added to Design department', userId: 'u1', userName: 'Rajesh Kumar', createdAt: d(-3) },
  { id: 'a7', action: 'Escalation Raised', details: 'Employee Training Portal escalated by Sneha Reddy', userId: 'u4', userName: 'Sneha Reddy', createdAt: d(-1) },
];
