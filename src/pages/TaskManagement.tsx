import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { TaskTable } from '@/components/TaskTable';
import { TaskModal, TaskFormData } from '@/components/TaskModal';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Task } from '@/types';

const TaskManagement: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useTaskContext();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleSave = (data: TaskFormData) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      addTask({ ...data, createdBy: user?.id || '' });
    }
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) deleteTask(id);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Task Management</h1>
          <p className="page-subtitle">Create, edit, and manage all tasks</p>
        </div>
        <Button onClick={() => { setEditingTask(null); setModalOpen(true); }}>
          <Plus className="h-4 w-4 mr-1.5" /> New Task
        </Button>
      </div>

      <TaskTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} showActions />
      <TaskModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSave={handleSave} task={editingTask} />
    </DashboardLayout>
  );
};

export default TaskManagement;
