import React, { useState } from 'react';
import { Project, ProjectStatus, ProjectPriority } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<Project>) => void;
  project?: Project | null;
}

const statuses: ProjectStatus[] = ['Pending', 'Ongoing', 'Completed', 'Escalated', 'Overdue'];
const priorities: ProjectPriority[] = ['Low', 'Medium', 'High', 'Critical'];

export const ProjectModal: React.FC<ProjectModalProps> = ({ open, onClose, onSave, project }) => {
  const { users, getUsersByRole } = useAuth();
  const managers = getUsersByRole('manager');
  const employees = getUsersByRole('employee');

  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || '',
    startDate: project?.startDate?.slice(0, 10) || new Date().toISOString().slice(0, 10),
    deadline: project?.deadline?.slice(0, 10) || '',
    managerId: project?.managerId || '',
    teamMembers: project?.teamMembers || [] as string[],
    priority: project?.priority || 'Medium' as ProjectPriority,
    status: project?.status || 'Pending' as ProjectStatus,
    progress: project?.progress || 0,
  });

  React.useEffect(() => {
    if (project) {
      setForm({
        name: project.name, description: project.description,
        startDate: project.startDate.slice(0, 10), deadline: project.deadline.slice(0, 10),
        managerId: project.managerId, teamMembers: project.teamMembers,
        priority: project.priority, status: project.status, progress: project.progress,
      });
    } else {
      setForm({ name: '', description: '', startDate: new Date().toISOString().slice(0, 10), deadline: '', managerId: '', teamMembers: [], priority: 'Medium', status: 'Pending', progress: 0 });
    }
  }, [project, open]);

  const handleSave = () => {
    if (!form.name || !form.deadline || !form.managerId) return;
    onSave({
      name: form.name, description: form.description,
      startDate: new Date(form.startDate).toISOString(), deadline: new Date(form.deadline).toISOString(),
      managerId: form.managerId, teamMembers: form.teamMembers,
      priority: form.priority, status: form.status, progress: form.progress,
    });
    onClose();
  };

  const toggleMember = (id: string) => {
    setForm(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(id) ? prev.teamMembers.filter(m => m !== id) : [...prev.teamMembers, id],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create New Project'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Project Name *</Label>
            <Input value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter project name" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Project description" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input type="date" value={form.startDate} onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))} />
            </div>
            <div>
              <Label>Deadline *</Label>
              <Input type="date" value={form.deadline} onChange={e => setForm(prev => ({ ...prev, deadline: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Assigned Manager *</Label>
            <Select value={form.managerId} onValueChange={v => setForm(prev => ({ ...prev, managerId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
              <SelectContent>
                {managers.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(prev => ({ ...prev, priority: v as ProjectPriority }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(prev => ({ ...prev, status: v as ProjectStatus }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Progress: {form.progress}%</Label>
            <input type="range" min={0} max={100} value={form.progress} onChange={e => setForm(prev => ({ ...prev, progress: Number(e.target.value) }))} className="w-full mt-1" />
          </div>
          <div>
            <Label>Team Members</Label>
            <div className="mt-2 space-y-1 max-h-32 overflow-y-auto border rounded-lg p-2">
              {employees.map(emp => (
                <label key={emp.id} className="flex items-center gap-2 py-1 px-2 hover:bg-muted rounded cursor-pointer text-sm">
                  <input type="checkbox" checked={form.teamMembers.includes(emp.id)} onChange={() => toggleMember(emp.id)} className="rounded" />
                  {emp.name} <span className="text-muted-foreground text-xs">({emp.department})</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} className="flex-1">{project ? 'Update' : 'Create'} Project</Button>
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
