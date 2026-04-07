import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { EscalationBadge } from '@/components/StatusBadge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { Escalation, EscalationStatus } from '@/types';
import { toast } from 'sonner';

interface EscalationsPageProps {
  roleFilter?: 'admin' | 'manager' | 'employee';
}

const EscalationsPage: React.FC<EscalationsPageProps> = ({ roleFilter = 'admin' }) => {
  const { escalations, updateEscalation, projects } = useProjectContext();
  const { user, getUserById } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Escalation | null>(null);
  const [remarks, setRemarks] = useState('');
  const [newStatus, setNewStatus] = useState<EscalationStatus>('Open');

  const filtered = escalations.filter(e => {
    if (roleFilter === 'manager') {
      const proj = projects.find(p => p.id === e.projectId);
      if (proj?.managerId !== user?.id) return false;
    }
    if (roleFilter === 'employee') {
      const proj = projects.find(p => p.id === e.projectId);
      if (!proj?.teamMembers.includes(user?.id || '')) return false;
    }
    const matchSearch = e.projectName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleUpdate = () => {
    if (!selected) return;
    updateEscalation(selected.id, { status: newStatus, remarks });
    setSelected(null);
    toast.success('Escalation updated');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Escalation Management</h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} escalation{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search escalations..." className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Review">In Review</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Project</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Reason</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Level</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Escalated By</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Date</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                {roleFilter !== 'employee' && <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-muted-foreground text-sm">No escalations found</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{e.projectName}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{e.reason}</td>
                  <td className="px-4 py-3 text-sm hidden md:table-cell">
                    <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-xs font-medium">Level {e.level}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{getUserById(e.escalatedBy)?.name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(e.escalationDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><EscalationBadge status={e.status} /></td>
                  {roleFilter !== 'employee' && (
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { setSelected(e); setRemarks(e.remarks); setNewStatus(e.status); }}>
                        Manage
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Manage Escalation</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div>
                <p className="text-sm font-medium">{selected.projectName}</p>
                <p className="text-xs text-muted-foreground mt-1">{selected.reason}</p>
              </div>
              <div>
                <Label>Update Status</Label>
                <Select value={newStatus} onValueChange={v => setNewStatus(v as EscalationStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Remarks</Label>
                <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} />
              </div>
              <Button onClick={handleUpdate} className="w-full">Update Escalation</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EscalationsPage;
