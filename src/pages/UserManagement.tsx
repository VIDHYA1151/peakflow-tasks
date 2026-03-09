import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Trash2 } from 'lucide-react';
import { UserRole } from '@/types';
import { Badge } from '@/components/ui/badge';

const roleBadge = (role: UserRole) => {
  const cls = role === 'admin' ? 'bg-primary/10 text-primary' : role === 'manager' ? 'badge-medium' : 'badge-low';
  return <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{role}</span>;
};

const UserManagement: React.FC = () => {
  const { users, addUser, removeUser } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' as UserRole, team: '' });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    addUser(form);
    setForm({ name: '', email: '', password: '', role: 'employee', team: '' });
    setModalOpen(false);
  };

  const teams = [...new Set(users.filter(u => u.team).map(u => u.team))];

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage system users and roles</p>
        </div>
        <Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4 mr-1.5" /> Add User</Button>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Team</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-muted/30">
                <td className="py-3 px-4 font-medium">{u.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
                <td className="py-3 px-4">{roleBadge(u.role)}</td>
                <td className="py-3 px-4 text-muted-foreground">{u.team || '—'}</td>
                <td className="py-3 px-4">
                  <button onClick={() => { if (confirm(`Remove ${u.name}?`)) removeUser(u.id); }} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required /></div>
            <div><Label>Password</Label><Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <select className="w-full px-3 py-2 text-sm border rounded-md bg-background" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <Label>Team</Label>
                <select className="w-full px-3 py-2 text-sm border rounded-md bg-background" value={form.team} onChange={e => setForm(p => ({ ...p, team: e.target.value }))}>
                  <option value="">No team</option>
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button type="submit">Create</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UserManagement;
