import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatsCard } from '@/components/StatsCard';
import { ProjectTable } from '@/components/ProjectTable';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';
import { FolderKanban, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ProgressBar } from '@/components/ProgressBar';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const COLORS = ['hsl(215,70%,55%)', 'hsl(142,72%,42%)', 'hsl(38,92%,50%)', 'hsl(0,72%,51%)', 'hsl(200,80%,50%)'];

const EmployeeDashboard: React.FC = () => {
  const { projects, activities, updateProject, addProjectComment, addEscalation, escalations } = useProjectContext();
  const { user, getUserById } = useAuth();
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [comment, setComment] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [showEscalation, setShowEscalation] = useState(false);
  const [progressVal, setProgressVal] = useState(0);

  const myProjects = projects.filter(p => p.teamMembers.includes(user?.id || ''));
  const completed = myProjects.filter(p => p.status === 'Completed');
  const ongoing = myProjects.filter(p => p.status === 'Ongoing');
  const pending = myProjects.filter(p => p.status === 'Pending');
  const escalated = myProjects.filter(p => p.status === 'Escalated');
  const overdue = myProjects.filter(p => p.status === 'Overdue');

  const statusData = [
    { name: 'Pending', value: pending.length },
    { name: 'Ongoing', value: ongoing.length },
    { name: 'Completed', value: completed.length },
    { name: 'Escalated', value: escalated.length },
    { name: 'Overdue', value: overdue.length },
  ].filter(d => d.value > 0);

  const upcoming = myProjects
    .filter(p => p.status !== 'Completed')
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 5);

  const handleUpdateProgress = (project: Project) => {
    updateProject(project.id, {
      progress: progressVal,
      status: progressVal >= 100 ? 'Completed' : project.status === 'Pending' ? 'Ongoing' : project.status,
    });
    toast.success('Progress updated');
  };

  const handleComment = (project: Project) => {
    if (!comment.trim()) return;
    addProjectComment(project.id, { userId: user!.id, userName: user!.name, text: comment });
    setComment('');
    toast.success('Comment added');
  };

  const handleEscalate = (project: Project) => {
    addEscalation({
      projectId: project.id, projectName: project.name,
      reason: escalationReason, level: 1,
      escalationDate: new Date().toISOString(),
      escalatedBy: user!.id, escalatedTo: project.managerId,
      status: 'Open', remarks: '',
    });
    updateProject(project.id, { status: 'Escalated' });
    setShowEscalation(false);
    setEscalationReason('');
    toast.success('Escalation request sent');
  };

  const myEscalations = escalations.filter(e => myProjects.some(p => p.id === e.projectId));

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Employee Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">View and update your assigned projects</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatsCard title="My Projects" value={myProjects.length} icon={FolderKanban} variant="primary" />
        <StatsCard title="Completed" value={completed.length} icon={CheckCircle} variant="success" />
        <StatsCard title="Ongoing" value={ongoing.length} icon={Clock} variant="info" />
        <StatsCard title="Pending" value={pending.length} icon={Clock} />
        <StatsCard title="Escalated" value={escalated.length} icon={AlertTriangle} variant="destructive" />
        <StatsCard title="Overdue" value={overdue.length} icon={XCircle} variant="warning" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Project Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground py-8 text-center">No projects assigned</p>}
        </div>
        <div className="bg-card border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Deadline Reminders</h3>
          <div className="space-y-3">
            {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming deadlines</p> : upcoming.map(p => {
              const isOverdue = new Date(p.deadline) < new Date();
              return (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <PriorityBadge priority={p.priority} />
                  </div>
                  <span className={`text-xs font-medium ${isOverdue ? 'text-destructive' : 'text-warning'}`}>
                    {new Date(p.deadline).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-base font-semibold text-foreground mb-3">My Projects</h3>
        <ProjectTable projects={myProjects} onView={p => { setViewProject(p); setProgressVal(p.progress); }} showActions />
      </div>

      {/* Escalation History */}
      {myEscalations.length > 0 && (
        <div className="bg-card border rounded-xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-foreground mb-4">Escalation History</h3>
          <div className="space-y-3">
            {myEscalations.map(e => (
              <div key={e.id} className="flex items-start justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{e.projectName}</p>
                  <p className="text-xs text-muted-foreground">{e.reason}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${e.status === 'Open' ? 'bg-destructive/10 text-destructive' : e.status === 'Resolved' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{e.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="bg-card border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {activities.slice(0, 5).map(a => (
            <div key={a.id} className="flex items-start gap-3 py-2 border-b last:border-0">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-foreground"><span className="font-medium">{a.action}</span> — {a.details}</p>
                <p className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Detail Dialog */}
      <Dialog open={!!viewProject} onOpenChange={() => setViewProject(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewProject?.name}</DialogTitle>
          </DialogHeader>
          {viewProject && (
            <div className="space-y-4 mt-2">
              <p className="text-sm text-muted-foreground">{viewProject.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Manager:</span> <span className="font-medium">{getUserById(viewProject.managerId)?.name}</span></div>
                <div><span className="text-muted-foreground">Deadline:</span> <span className="font-medium">{new Date(viewProject.deadline).toLocaleDateString()}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={viewProject.status} /></div>
                <div><span className="text-muted-foreground">Priority:</span> <PriorityBadge priority={viewProject.priority} /></div>
              </div>
              <div>
                <Label>Update Progress: {progressVal}%</Label>
                <input type="range" min={0} max={100} value={progressVal} onChange={e => setProgressVal(Number(e.target.value))} className="w-full mt-1" />
                <Button size="sm" className="mt-2" onClick={() => handleUpdateProgress(viewProject)}>Update Progress</Button>
              </div>
              <div>
                <Label>Add Comment</Label>
                <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a note or comment..." rows={2} className="mt-1" />
                <Button size="sm" className="mt-2" onClick={() => handleComment(viewProject)}>Add Comment</Button>
              </div>
              {viewProject.comments.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Comments</p>
                  {viewProject.comments.map(c => (
                    <div key={c.id} className="border-b py-2 last:border-0">
                      <p className="text-sm">{c.text}</p>
                      <p className="text-xs text-muted-foreground">{c.userName} · {new Date(c.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="border-t pt-3">
                {!showEscalation ? (
                  <Button variant="destructive" size="sm" onClick={() => setShowEscalation(true)}>Request Escalation</Button>
                ) : (
                  <div className="space-y-2">
                    <Label>Escalation Reason</Label>
                    <Textarea value={escalationReason} onChange={e => setEscalationReason(e.target.value)} placeholder="Why is this project blocked?" rows={2} />
                    <div className="flex gap-2">
                      <Button size="sm" variant="destructive" onClick={() => handleEscalate(viewProject)}>Submit Escalation</Button>
                      <Button size="sm" variant="outline" onClick={() => setShowEscalation(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
