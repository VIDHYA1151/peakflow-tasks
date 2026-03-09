import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { TaskTable } from '@/components/TaskTable';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(220,70%,50%)', 'hsl(142,72%,42%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(280,60%,50%)', 'hsl(200,80%,50%)'];

const AdminDashboard: React.FC = () => {
  const { tasks, getOverdueTasks } = useTaskContext();
  const { users } = useAuth();

  const overdue = getOverdueTasks();
  const statusData = ['To Do', 'Ideating', 'Testing', 'In Review', 'Concepting', 'Launched'].map(s => ({
    name: s, value: tasks.filter(t => t.status === s).length,
  }));
  const priorityData = ['Low', 'Medium', 'High', 'Critical'].map(p => ({
    name: p, value: tasks.filter(t => t.priority === p).length,
  }));
  const escalatedTasks = tasks.filter(t => t.escalationLevel > 0);

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Overview of all tasks, users, and escalations</p>
      </div>

      <div className="dashboard-grid grid-cols-2 md:grid-cols-4 mb-6">
        <StatsCard title="Total Tasks" value={tasks.length} variant="primary" />
        <StatsCard title="Overdue Tasks" value={overdue.length} variant="destructive" />
        <StatsCard title="Escalated" value={escalatedTasks.length} variant="warning" />
        <StatsCard title="Total Users" value={users.length} variant="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card rounded-lg border p-5 shadow-sm">
          <h3 className="text-sm font-medium text-foreground mb-4">Tasks by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(220,70%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border p-5 shadow-sm">
          <h3 className="text-sm font-medium text-foreground mb-4">Tasks by Priority</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={priorityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {priorityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-2">
        <h3 className="text-sm font-medium text-foreground mb-3">Recent Tasks</h3>
      </div>
      <TaskTable tasks={tasks.slice(0, 10)} />
    </DashboardLayout>
  );
};

export default AdminDashboard;
