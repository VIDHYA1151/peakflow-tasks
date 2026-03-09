import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { useTaskContext } from '@/context/TaskContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['hsl(220,70%,50%)', 'hsl(142,72%,42%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(280,60%,50%)', 'hsl(200,80%,50%)'];

const Analytics: React.FC = () => {
  const { tasks, teams, getOverdueTasks } = useTaskContext();

  const overdue = getOverdueTasks();
  const launched = tasks.filter(t => t.status === 'Launched').length;

  const statusData = ['To Do', 'Ideating', 'Testing', 'In Review', 'Concepting', 'Launched'].map(s => ({
    name: s, value: tasks.filter(t => t.status === s).length,
  }));

  const priorityData = ['Low', 'Medium', 'High', 'Critical'].map(p => ({
    name: p, value: tasks.filter(t => t.priority === p).length,
  }));

  const teamData = teams.map(t => ({
    name: t.teamName,
    total: tasks.filter(tk => tk.teamName === t.teamName).length,
    overdue: tasks.filter(tk => tk.teamName === t.teamName && new Date(tk.dueDate) < new Date() && tk.status !== 'Launched').length,
  }));

  const escalationData = [
    { name: 'Normal', value: tasks.filter(t => t.escalationLevel === 0).length },
    { name: 'L1 Manager', value: tasks.filter(t => t.escalationLevel === 1).length },
    { name: 'L2 Admin', value: tasks.filter(t => t.escalationLevel === 2).length },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Task distribution and performance metrics</p>
      </div>

      <div className="dashboard-grid grid-cols-2 md:grid-cols-4 mb-6">
        <StatsCard title="Total Tasks" value={tasks.length} variant="primary" />
        <StatsCard title="Completed" value={launched} variant="success" />
        <StatsCard title="Overdue" value={overdue.length} variant="destructive" />
        <StatsCard title="Teams" value={teams.length} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg border p-5 shadow-sm">
          <h3 className="text-sm font-medium text-foreground mb-4">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(220,70%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5 shadow-sm">
          <h3 className="text-sm font-medium text-foreground mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5 shadow-sm">
          <h3 className="text-sm font-medium text-foreground mb-4">Tasks by Team</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={teamData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="total" fill="hsl(220,70%,50%)" radius={[4, 4, 0, 0]} name="Total" />
              <Bar dataKey="overdue" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} name="Overdue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5 shadow-sm">
          <h3 className="text-sm font-medium text-foreground mb-4">Escalation Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={escalationData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {escalationData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
