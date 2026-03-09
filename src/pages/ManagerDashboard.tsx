import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { TaskTable } from '@/components/TaskTable';
import { TaskModal, TaskFormData } from '@/components/TaskModal';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types';

const ManagerDashboard: React.FC = () => {
  const { tasks, addTask, updateTask, getOverdueTasks } = useTaskContext();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const teamTasks = tasks.filter(t => t.teamName === user?.team);
  const overdue = teamTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Launched');
  const escalated = teamTasks.filter(t => t.escalationLevel > 0);

  const handleSave = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask({ ...data, createdBy: user?.id || '', teamName: user?.team || '' });
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Manager Dashboard</h1>
          <p className="page-subtitle">Team: {user?.team || 'No team assigned'}</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-1.5" /> Assign Task
        </Button>
      </div>

      <div className="dashboard-grid grid-cols-2 md:grid-cols-4 mb-6">
        <StatsCard title="Team Tasks" value={teamTasks.length} variant="primary" />
        <StatsCard title="Overdue" value={overdue.length} variant="destructive" />
        <StatsCard title="Escalated" value={escalated.length} variant="warning" />
        <StatsCard title="Completed" value={teamTasks.filter(t => t.status === 'Launched').length} variant="success" />
      </div>

      <TaskTable tasks={teamTasks} onEdit={handleEdit} showActions />
      <TaskModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSave={handleSave} task={editingTask} teamFilter={user?.team} />
    </DashboardLayout>
  );
};

export default ManagerDashboard;
