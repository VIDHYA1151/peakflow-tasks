import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  showActions?: boolean;
}

const priorityClass: Record<TaskPriority, string> = {
  Low: 'badge-low',
  Medium: 'badge-medium',
  High: 'badge-high',
  Critical: 'badge-critical',
};

const statusClass: Record<TaskStatus, string> = {
  'To Do': 'status-todo',
  Ideating: 'status-ideating',
  Testing: 'status-testing',
  'In Review': 'status-review',
  Concepting: 'status-concepting',
  Launched: 'status-launched',
};

const escalationLabel = (level: number) => {
  if (level === 0) return null;
  if (level === 1) return <Badge variant="outline" className="border-warning text-warning text-xs">L1 - Manager</Badge>;
  return <Badge variant="outline" className="border-destructive text-destructive text-xs">L2 - Admin</Badge>;
};

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete, showActions = false }) => {
  const { getUserById } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const filtered = tasks.filter(t => {
    const matchSearch = t.summary.toLowerCase().includes(search.toLowerCase()) || t.taskId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || t.status === statusFilter;
    const matchPriority = !priorityFilter || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const isOverdue = (t: Task) => new Date(t.dueDate) < new Date() && t.status !== 'Launched';

  return (
    <div className="table-container">
      <div className="p-4 border-b flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-3 py-1.5 text-sm border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-primary w-64"
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border rounded-md bg-background"
        >
          <option value="">All Status</option>
          {(['To Do', 'Ideating', 'Testing', 'In Review', 'Concepting', 'Launched'] as TaskStatus[]).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          className="px-3 py-1.5 text-sm border rounded-md bg-background"
        >
          <option value="">All Priority</option>
          {(['Low', 'Medium', 'High', 'Critical'] as TaskPriority[]).map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Summary</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Priority</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Assignee</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Due Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Escalation</th>
              {showActions && <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={showActions ? 8 : 7} className="text-center py-8 text-muted-foreground">No tasks found</td></tr>
            )}
            {filtered.map(task => {
              const assignee = getUserById(task.assignee);
              return (
                <tr key={task.id} className={`border-b hover:bg-muted/30 transition-colors ${isOverdue(task) ? 'bg-destructive/5' : ''}`}>
                  <td className="py-3 px-4 font-mono text-xs text-muted-foreground">{task.taskId}</td>
                  <td className="py-3 px-4 font-medium max-w-xs truncate">{task.summary}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusClass[task.status]}`}>{task.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${priorityClass[task.priority]}`}>{task.priority}</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{assignee?.name || 'Unassigned'}</td>
                  <td className={`py-3 px-4 ${isOverdue(task) ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                    {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="py-3 px-4">{escalationLabel(task.escalationLevel) || <span className="text-xs text-muted-foreground">Normal</span>}</td>
                  {showActions && (
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {onEdit && (
                          <button onClick={() => onEdit(task)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-primary">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(task.id)} className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
