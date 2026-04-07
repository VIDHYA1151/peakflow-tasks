import React, { useState } from 'react';
import { Project } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/ProgressBar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Edit2, Trash2, Eye } from 'lucide-react';

interface ProjectTableProps {
  projects: Project[];
  onEdit?: (project: Project) => void;
  onDelete?: (id: string) => void;
  onView?: (project: Project) => void;
  showActions?: boolean;
  compact?: boolean;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEdit, onDelete, onView, showActions = true, compact = false }) => {
  const { getUserById } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.projectId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || p.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
      {!compact && (
        <div className="p-4 border-b flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Escalated">Escalated</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Priority" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Project</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Manager</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Team</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Deadline</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Progress</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Priority</th>
              <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
              {showActions && <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8 text-muted-foreground text-sm">No projects found</td></tr>
            ) : filtered.map(p => {
              const manager = getUserById(p.managerId);
              const isOverdue = new Date(p.deadline) < new Date() && p.status !== 'Completed';
              return (
                <tr key={p.id} className={`border-b last:border-0 hover:bg-muted/20 transition-colors ${isOverdue ? 'bg-destructive/5' : ''}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.projectId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{manager?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{p.teamMembers.length} members</td>
                  <td className="px-4 py-3 text-sm hidden lg:table-cell">
                    <span className={isOverdue ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                      {new Date(p.deadline).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-32">
                    <ProgressBar value={p.progress} />
                  </td>
                  <td className="px-4 py-3"><PriorityBadge priority={p.priority} /></td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  {showActions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onView && <Button variant="ghost" size="sm" onClick={() => onView(p)}><Eye className="h-3.5 w-3.5" /></Button>}
                        {onEdit && <Button variant="ghost" size="sm" onClick={() => onEdit(p)}><Edit2 className="h-3.5 w-3.5" /></Button>}
                        {onDelete && <Button variant="ghost" size="sm" onClick={() => onDelete(p.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>}
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
