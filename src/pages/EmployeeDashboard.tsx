import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Task, TaskStatus } from '@/types';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const statuses: TaskStatus[] = ['To Do', 'Ideating', 'Testing', 'In Review', 'Concepting', 'Launched'];

const statusClass: Record<TaskStatus, string> = {
  'To Do': 'status-todo', Ideating: 'status-ideating', Testing: 'status-testing',
  'In Review': 'status-review', Concepting: 'status-concepting', Launched: 'status-launched',
};

const EmployeeDashboard: React.FC = () => {
  const { tasks, updateTask, addComment } = useTaskContext();
  const { user } = useAuth();
  const myTasks = tasks.filter(t => t.assignee === user?.id);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [comment, setComment] = useState('');

  const overdue = myTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Launched');

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTask(taskId, { status });
  };

  const handleComment = () => {
    if (selectedTask && comment.trim()) {
      addComment(selectedTask.id, { userId: user?.id || '', userName: user?.name || '', text: comment });
      setComment('');
      // refresh selected task
      const updated = tasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask({ ...updated });
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
        <p className="page-subtitle">View and update your assigned tasks</p>
      </div>

      <div className="dashboard-grid grid-cols-2 md:grid-cols-4 mb-6">
        <StatsCard title="Assigned Tasks" value={myTasks.length} variant="primary" />
        <StatsCard title="Overdue" value={overdue.length} variant="destructive" />
        <StatsCard title="In Progress" value={myTasks.filter(t => !['To Do', 'Launched'].includes(t.status)).length} variant="warning" />
        <StatsCard title="Completed" value={myTasks.filter(t => t.status === 'Launched').length} variant="success" />
      </div>

      <div className="space-y-3">
        {myTasks.length === 0 && <p className="text-center py-16 text-muted-foreground">No tasks assigned to you.</p>}
        {myTasks.map(task => {
          const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'Launched';
          return (
            <div key={task.id} className={`bg-card rounded-lg border p-4 shadow-sm ${isOverdue ? 'border-destructive/40' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{task.taskId}</span>
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusClass[task.status]}`}>{task.status}</span>
                    {isOverdue && <Badge variant="destructive" className="text-xs">Overdue</Badge>}
                  </div>
                  <h3 className="font-medium text-foreground">{task.summary}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')} · Priority: {task.priority}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="px-2 py-1 text-xs border rounded bg-background"
                    value={task.status}
                    onChange={e => handleStatusChange(task.id, e.target.value as TaskStatus)}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => setSelectedTask(task)}>Details</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{selectedTask?.taskId} — {selectedTask?.summary}</DialogTitle></DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <span className="font-medium">{selectedTask.status}</span></div>
                <div><span className="text-muted-foreground">Priority:</span> <span className="font-medium">{selectedTask.priority}</span></div>
                <div><span className="text-muted-foreground">Due:</span> <span className="font-medium">{format(new Date(selectedTask.dueDate), 'MMM dd, yyyy')}</span></div>
                <div><span className="text-muted-foreground">Team:</span> <span className="font-medium">{selectedTask.teamName}</span></div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Comments</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedTask.comments.length === 0 && <p className="text-xs text-muted-foreground">No comments yet.</p>}
                  {selectedTask.comments.map(c => (
                    <div key={c.id} className="bg-muted rounded p-2 text-xs">
                      <span className="font-medium">{c.userName}:</span> {c.text}
                      <span className="text-muted-foreground ml-2">{format(new Date(c.createdAt), 'MMM dd, HH:mm')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} className="text-sm" />
                  <Button size="sm" onClick={handleComment}>Send</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
