import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TaskTable } from '@/components/TaskTable';
import { useTaskContext } from '@/context/TaskContext';

const EscalationMonitor: React.FC = () => {
  const { tasks } = useTaskContext();
  const l1Tasks = tasks.filter(t => t.escalationLevel === 1);
  const l2Tasks = tasks.filter(t => t.escalationLevel === 2);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Escalation Monitor</h1>
        <p className="page-subtitle">Track escalated tasks and their resolution status</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="stat-card border-l-4 border-l-warning">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Level 1 — Manager</p>
          <p className="text-2xl font-bold text-foreground mt-1">{l1Tasks.length}</p>
        </div>
        <div className="stat-card border-l-4 border-l-destructive">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Level 2 — Admin</p>
          <p className="text-2xl font-bold text-foreground mt-1">{l2Tasks.length}</p>
        </div>
      </div>

      {l2Tasks.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Level 2 Escalations (Admin)</h3>
          <TaskTable tasks={l2Tasks} />
        </div>
      )}

      {l1Tasks.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Level 1 Escalations (Manager)</h3>
          <TaskTable tasks={l1Tasks} />
        </div>
      )}

      {l1Tasks.length === 0 && l2Tasks.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">No escalated tasks at this time.</div>
      )}
    </DashboardLayout>
  );
};

export default EscalationMonitor;
