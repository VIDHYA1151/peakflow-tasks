import React from 'react';
import { ProjectStatus, ProjectPriority, EscalationStatus } from '@/types';

const statusColors: Record<ProjectStatus, string> = {
  Pending: 'bg-muted text-muted-foreground',
  Ongoing: 'bg-info/10 text-info',
  Completed: 'bg-success/10 text-success',
  Escalated: 'bg-destructive/10 text-destructive',
  Overdue: 'bg-warning/10 text-warning',
};

const priorityColors: Record<ProjectPriority, string> = {
  Low: 'bg-muted text-muted-foreground',
  Medium: 'bg-info/10 text-info',
  High: 'bg-warning/10 text-warning',
  Critical: 'bg-destructive/10 text-destructive',
};

const escalationStatusColors: Record<EscalationStatus, string> = {
  Open: 'bg-destructive/10 text-destructive',
  'In Review': 'bg-warning/10 text-warning',
  Resolved: 'bg-success/10 text-success',
  Closed: 'bg-muted text-muted-foreground',
};

export const StatusBadge: React.FC<{ status: ProjectStatus }> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
    {status}
  </span>
);

export const PriorityBadge: React.FC<{ priority: ProjectPriority }> = ({ priority }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
    {priority}
  </span>
);

export const EscalationBadge: React.FC<{ status: EscalationStatus }> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${escalationStatusColors[status]}`}>
    {status}
  </span>
);
