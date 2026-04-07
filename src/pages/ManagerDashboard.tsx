import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { ProjectTable } from '@/components/ProjectTable';
import { ProjectModal } from '@/components/ProjectModal';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban, CheckCircle, Clock, AlertTriangle, UsersRound, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['hsl(215,70%,55%)', 'hsl(142,72%,42%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(200,80%,50%)'];

const ManagerDashboard: React.FC = () => {
  const { projects, activities, updateProject } = useProjectContext();
  const { user, getUsersByRole } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const myProjects = projects.filter(p => p.managerId === user?.id);
  const completed = myProjects.filter(p => p.status === 'Completed');
  const ongoing = myProjects.filter(p => p.status === 'Ongoing');
  const pending = myProjects.filter(p => p.status === 'Pending');
  const escalated = myProjects.filter(p => p.status === 'Escalated');
  const overdue = myProjects.filter(p => p.status === 'Overdue');
  const teamMemberIds = [...new Set(myProjects.flatMap(p => p.teamMembers))];

  const statusData = [
    { name: 'Pending', value: pending.length },
    { name: 'Ongoing', value: ongoing.length },
    { name: 'Completed', value: completed.length },
    { name: 'Escalated', value: escalated.length },
    { name: 'Overdue', value: overdue.length },
  ].filter(d => d.value > 0);

  const handleSave = (data: Partial<Project>) => {
    if (editing) updateProject(editing.id, data);
    setEditing(null);
  };

  // Upcoming deadlines
  const upcoming = myProjects
    .filter(p => p.status !== 'Completed' && new Date(p.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manager Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your assigned projects and team</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
        <StatsCard title="Assigned Projects" value={myProjects.length} icon={FolderKanban} variant="primary" />
        <StatsCard title="Completed" value={completed.length} icon={CheckCircle} variant="success" />
        <StatsCard title="Ongoing" value={ongoing.length} icon={Clock} variant="info" />
        <StatsCard title="Pending" value={pending.length} icon={Clock} />
        <StatsCard title="Escalated" value={escalated.length} icon={AlertTriangle} variant="destructive" />
        <StatsCard title="Overdue" value={overdue.length} icon={XCircle} variant="warning" />
        <StatsCard title="Team Members" value={teamMemberIds.length} icon={UsersRound} variant="info" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming deadlines</p> : upcoming.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.priority} Priority</p>
                </div>
                <span className="text-xs font-medium text-warning">{new Date(p.deadline).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-base font-semibold text-foreground mb-3">Assigned Projects</h3>
        <ProjectTable projects={myProjects} onEdit={(p) => { setEditing(p); setModalOpen(true); }} showActions />
      </div>

      {/* Recent Activity */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b last:border-0">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground"><span className="font-medium">{a.action}</span> — {a.details}</p>
                <p className="text-xs text-muted-foreground">{a.userName} · {new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ProjectModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} project={editing} />
    </DashboardLayout>
  );
};

export default ManagerDashboard;
