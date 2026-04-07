import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const COLORS = ['hsl(215,70%,55%)', 'hsl(142,72%,42%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(200,80%,50%)'];

interface ReportsPageProps {
  roleFilter?: 'admin' | 'manager' | 'employee';
}

const ReportsPage: React.FC<ReportsPageProps> = ({ roleFilter = 'admin' }) => {
  const { projects, escalations } = useProjectContext();
  const { user, getUserById } = useAuth();

  const filtered = roleFilter === 'manager'
    ? projects.filter(p => p.managerId === user?.id)
    : roleFilter === 'employee'
    ? projects.filter(p => p.teamMembers.includes(user?.id || ''))
    : projects;

  const statusData = [
    { name: 'Pending', value: filtered.filter(p => p.status === 'Pending').length },
    { name: 'Ongoing', value: filtered.filter(p => p.status === 'Ongoing').length },
    { name: 'Completed', value: filtered.filter(p => p.status === 'Completed').length },
    { name: 'Escalated', value: filtered.filter(p => p.status === 'Escalated').length },
    { name: 'Overdue', value: filtered.filter(p => p.status === 'Overdue').length },
  ].filter(d => d.value > 0);

  const priorityData = [
    { name: 'Low', value: filtered.filter(p => p.priority === 'Low').length },
    { name: 'Medium', value: filtered.filter(p => p.priority === 'Medium').length },
    { name: 'High', value: filtered.filter(p => p.priority === 'High').length },
    { name: 'Critical', value: filtered.filter(p => p.priority === 'Critical').length },
  ].filter(d => d.value > 0);

  const progressData = filtered.slice(0, 10).map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name,
    progress: p.progress,
  }));

  const overdueProjects = filtered.filter(p => new Date(p.deadline) < new Date() && p.status !== 'Completed');

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Comprehensive overview and insights</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Priority Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-5 mb-8">
        <h3 className="text-sm font-semibold text-foreground mb-4">Project Completion Progress</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="progress" fill="hsl(220,70%,50%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Overdue Report */}
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Overdue Projects ({overdueProjects.length})</h3>
          <div className="space-y-3">
            {overdueProjects.length === 0 ? <p className="text-sm text-muted-foreground">No overdue projects</p> : overdueProjects.map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">Manager: {getUserById(p.managerId)?.name}</p>
                </div>
                <span className="text-xs text-destructive font-medium">{new Date(p.deadline).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Report */}
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Escalation Summary ({escalations.length})</h3>
          <div className="space-y-3">
            {escalations.length === 0 ? <p className="text-sm text-muted-foreground">No escalations</p> : escalations.slice(0, 6).map(e => (
              <div key={e.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{e.projectName}</p>
                  <p className="text-xs text-muted-foreground">Level {e.level} · {e.reason.slice(0, 40)}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'Open' ? 'bg-destructive/10 text-destructive' : e.status === 'Resolved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{e.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
