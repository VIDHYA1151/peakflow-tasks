import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, EscalationLevel } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: TaskFormData) => void;
  task?: Task | null;
  teamFilter?: string;
}

export interface TaskFormData {
  summary: string;
  status: TaskStatus;
  assignee: string;
  priority: TaskPriority;
  dueDate: string;
  teamName: string;
  escalationLevel: EscalationLevel;
}

const statuses: TaskStatus[] = ['To Do', 'Ideating', 'Testing', 'In Review', 'Concepting', 'Launched'];
const priorities: TaskPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const TaskModal: React.FC<TaskModalProps> = ({ open, onClose, onSave, task, teamFilter }) => {
  const { users } = useAuth();
  const assignableUsers = users.filter(u => u.role !== 'admin');

  const [form, setForm] = useState<TaskFormData>({
    summary: '', status: 'To Do', assignee: '', priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0], teamName: teamFilter || '', escalationLevel: 0,
  });

  useEffect(() => {
    if (task) {
      setForm({
        summary: task.summary, status: task.status, assignee: task.assignee,
        priority: task.priority, dueDate: task.dueDate.split('T')[0],
        teamName: task.teamName, escalationLevel: task.escalationLevel,
      });
    } else {
      setForm({
        summary: '', status: 'To Do', assignee: '', priority: 'Medium',
        dueDate: new Date().toISOString().split('T')[0], teamName: teamFilter || '', escalationLevel: 0,
      });
    }
  }, [task, teamFilter, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, dueDate: new Date(form.dueDate).toISOString() });
    onClose();
  };

  const teams = [...new Set(users.filter(u => u.team).map(u => u.team))];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Summary</Label>
            <Input value={form.summary} onChange={e => setForm(p => ({ ...p, summary: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Status</Label>
              <select className="w-full px-3 py-2 text-sm border rounded-md bg-background" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as TaskStatus }))}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <Label>Priority</Label>
              <select className="w-full px-3 py-2 text-sm border rounded-md bg-background" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as TaskPriority }))}>
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Assignee</Label>
              <select className="w-full px-3 py-2 text-sm border rounded-md bg-background" value={form.assignee} onChange={e => setForm(p => ({ ...p, assignee: e.target.value }))}>
                <option value="">Select assignee</option>
                {assignableUsers.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <div>
              <Label>Team</Label>
              <select className="w-full px-3 py-2 text-sm border rounded-md bg-background" value={form.teamName} onChange={e => setForm(p => ({ ...p, teamName: e.target.value }))}>
                <option value="">Select team</option>
                {teams.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <Label>Due Date</Label>
            <Input type="date" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} required />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{task ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
