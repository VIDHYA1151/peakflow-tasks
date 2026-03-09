import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useTaskContext } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2, Users } from 'lucide-react';

const TeamManagement: React.FC = () => {
  const { teams, addTeam, deleteTeam } = useTaskContext();
  const { users, getUserById } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [managerId, setManagerId] = useState('');

  const managers = users.filter(u => u.role === 'manager');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addTeam({ teamName, manager: managerId, members: [] });
    setTeamName('');
    setManagerId('');
    setModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">Team Management</h1>
          <p className="page-subtitle">Manage teams and their members</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4 mr-1.5" /> New Team</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(team => {
          const manager = getUserById(team.manager);
          const memberUsers = team.members.map(m => getUserById(m)).filter(Boolean);
          return (
            <div key={team.id} className="bg-card rounded-lg border p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="font-medium text-foreground">{team.teamName}</h3>
                </div>
                <button onClick={() => { if (confirm('Delete this team?')) deleteTeam(team.id); }} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Manager: {manager?.name || 'Unassigned'}</p>
              <p className="text-sm text-muted-foreground mt-1">Members: {memberUsers.length > 0 ? memberUsers.map(u => u!.name).join(', ') : 'None'}</p>
            </div>
          );
        })}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Create Team</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div><Label>Team Name</Label><Input value={teamName} onChange={e => setTeamName(e.target.value)} required /></div>
            <div>
              <Label>Manager</Label>
              <select className="w-full px-3 py-2 text-sm border rounded-md bg-background" value={managerId} onChange={e => setManagerId(e.target.value)}>
                <option value="">Select manager</option>
                {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default TeamManagement;
