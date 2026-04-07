import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { ProgressBar } from '@/components/ProgressBar';

const TeamMembersPage: React.FC = () => {
  const { projects } = useProjectContext();
  const { user, getUserById } = useAuth();

  const myProjects = projects.filter(p => p.managerId === user?.id);
  const memberIds = [...new Set(myProjects.flatMap(p => p.teamMembers))];

  const memberStats = memberIds.map(id => {
    const member = getUserById(id);
    const memberProjects = myProjects.filter(p => p.teamMembers.includes(id));
    const completed = memberProjects.filter(p => p.status === 'Completed').length;
    const ongoing = memberProjects.filter(p => p.status === 'Ongoing').length;
    const overdue = memberProjects.filter(p => new Date(p.deadline) < new Date() && p.status !== 'Completed').length;
    const perf = memberProjects.length > 0 ? Math.round((completed / memberProjects.length) * 100) : 0;
    return { member, total: memberProjects.length, completed, ongoing, overdue, performance: perf };
  });

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Team Members</h1>
        <p className="text-sm text-muted-foreground mt-1">{memberIds.length} member{memberIds.length !== 1 ? 's' : ''} in your team</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Employee</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Department</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Assigned</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Completed</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Ongoing</th>
                <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Overdue</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Performance</th>
              </tr>
            </thead>
            <tbody>
              {memberStats.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-sm">No team members</td></tr>
              ) : memberStats.map(m => (
                <tr key={m.member?.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{m.member?.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{m.member?.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{m.member?.department}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium">{m.total}</td>
                  <td className="px-4 py-3 text-center text-sm text-success font-medium">{m.completed}</td>
                  <td className="px-4 py-3 text-center text-sm text-info font-medium">{m.ongoing}</td>
                  <td className="px-4 py-3 text-center text-sm text-destructive font-medium">{m.overdue}</td>
                  <td className="px-4 py-3 w-36"><ProgressBar value={m.performance} size="md" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeamMembersPage;
