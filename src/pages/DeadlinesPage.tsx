import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { Calendar, AlertTriangle } from 'lucide-react';

const DeadlinesPage: React.FC = () => {
  const { projects } = useProjectContext();
  const { user } = useAuth();

  const myProjects = projects.filter(p => p.teamMembers.includes(user?.id || ''));
  const now = new Date();

  const upcoming = myProjects
    .filter(p => p.status !== 'Completed' && new Date(p.deadline) > now)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const overdue = myProjects
    .filter(p => p.status !== 'Completed' && new Date(p.deadline) < now)
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const getDaysRemaining = (deadline: string) => {
    const diff = Math.ceil((new Date(deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Deadlines</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your project deadlines</p>
      </div>

      {overdue.length > 0 && (
        <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <h3 className="text-sm font-semibold text-destructive">Overdue Projects ({overdue.length})</h3>
          </div>
          <div className="space-y-3">
            {overdue.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-destructive/10 last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <PriorityBadge priority={p.priority} />
                    <StatusBadge status={p.status} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-destructive">{new Date(p.deadline).toLocaleDateString()}</p>
                  <p className="text-xs text-destructive">{Math.abs(getDaysRemaining(p.deadline))} days overdue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Upcoming Deadlines ({upcoming.length})</h3>
        </div>
        <div className="space-y-3">
          {upcoming.length === 0 ? <p className="text-sm text-muted-foreground py-4 text-center">No upcoming deadlines</p> : upcoming.map(p => {
            const days = getDaysRemaining(p.deadline);
            return (
              <div key={p.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <PriorityBadge priority={p.priority} />
                    <StatusBadge status={p.status} />
                    <span className="text-xs text-muted-foreground">{p.progress}% complete</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{new Date(p.deadline).toLocaleDateString()}</p>
                  <p className={`text-xs ${days <= 7 ? 'text-warning' : 'text-muted-foreground'}`}>{days} day{days !== 1 ? 's' : ''} remaining</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DeadlinesPage;
