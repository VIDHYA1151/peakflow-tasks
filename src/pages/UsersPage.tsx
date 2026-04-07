import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { User, UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const UsersPage: React.FC = () => {
  const { users, addUser, updateUser, removeUser } = useAuth();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' as UserRole, department: '', status: 'Active' as 'Active' | 'Inactive' });

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', email: '', password: '', role: 'employee', department: '', status: 'Active' });
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: '', role: u.role, department: u.department, status: u.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editing) {
      const data: Partial<User> = { name: form.name, email: form.email, role: form.role, department: form.department, status: form.status };
      if (form.password) data.password = form.password;
      updateUser(editing.id, data);
      toast.success('User updated');
    } else {
      if (!form.password) return;
      addUser({ name: form.name, email: form.email, password: form.password, role: form.role, department: form.department, status: form.status });
      toast.success('User created');
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    removeUser(id);
    toast.success('User removed');
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} users</p>
        </div>
        <Button onClick={openCreate} className="gap-1.5"><Plus className="h-4 w-4" /> Add User</Button>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="pl-9" />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="employee">Employee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3 hidden md:table-cell">Department</th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-primary/10 text-primary' : u.role === 'manager' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{u.department}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'Active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(u)}><Edit2 className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(u.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit User' : 'Add New User'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>Full Name</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Enter name" /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="Enter email" /></div>
            <div><Label>{editing ? 'New Password (leave blank to keep)' : 'Password'}</Label><Input type="password" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="Enter password" /></div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm(p => ({ ...p, role: v as UserRole }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Department</Label><Input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} placeholder="Department" /></div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as 'Active' | 'Inactive' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSave} className="w-full">{editing ? 'Update' : 'Create'} User</Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default UsersPage;
