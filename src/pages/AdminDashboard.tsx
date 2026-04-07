import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { ProjectTable } from '@/components/ProjectTable';
import { ProjectModal } from '@/components/ProjectModal';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, FolderKanban, CheckCircle, Clock, AlertTriangle, Users, UserCog, UsersRound, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const COLORS = ['hsl(215,70%,55%)', 'hsl(142,72%,42%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(200,80%,50%)'];

const AdminDashboard: React.FC = () => {
  const { projects, escalations, activities, addProject, updateProject, deleteProject } = useProjectContext();
  const { users, getUsersByRole } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const managers = getUsersByRole('manager');
  const employees = getUsersByRole('employee');
  const completed = projects.filter(p => p.status === 'Completed');
  const ongoing = projects.filter(p => p.status === 'Ongoing');
  const pending = projects.filter(p => p.status === 'Pending');
  const escalated = projects.filter(p => p.status === 'Escalated');
  const overdue = projects.filter(p => p.status === 'Overdue');

  const statusData = [
    { name: 'Pending', value: pending.length },
    { name: 'Ongoing', value: ongoing.length },
    { name: 'Completed', value: completed.length },
    { name: 'Escalated', value: escalated.length },
    { name: 'Overdue', value: overdue.length },
  ].filter(d => d.value > 0);

  const completionData = projects.slice(0, 8).map(p => ({ name: p.name.slice(0, 15), progress: p.progress }));

  const handleSave = (data: Partial<Project>) => {
    if (editing) {
      updateProject(editing.id, data);
    } else {
      addProject(data as any);
    }
    setEditing(null);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete system overview and management</p>
        </div>
        <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatsCard title="Total Projects" value={projects.length} icon={FolderKanban} variant="primary" />
        <StatsCard title="Completed" value={completed.length} icon={CheckCircle} variant="success" />
        <StatsCard title="Ongoing" value={ongoing.length} icon={Clock} variant="info" />
        <StatsCard title="Escalated" value={escalated.length} icon={AlertTriangle} variant="destructive" />
        <StatsCard title="Overdue" value={overdue.length} icon={XCircle} variant="warning" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Pending" value={pending.length} icon={Clock} />
        <StatsCard title="Total Users" value={users.length} icon={Users} variant="primary" />
        <StatsCard title="Managers" value={managers.length} icon={UserCog} variant="info" />
        <StatsCard title="Employees" value={employees.length} icon={UsersRound} variant="success" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Completion Progress</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={completionData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="progress" fill="hsl(220,70%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Table */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-foreground mb-3">All Projects</h3>
        <ProjectTable
          projects={projects}
          onEdit={(p) => { setEditing(p); setModalOpen(true); }}
          onDelete={deleteProject}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 6).map(a => (
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

export default AdminDashboard;
