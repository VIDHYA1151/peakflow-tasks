import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');

  if (!user) return null;

  const handleUpdate = () => {
    updateUser(user.id, { name, email });
    toast.success('Profile updated');
  };

  const handlePasswordChange = () => {
    if (currentPw !== user.password) { toast.error('Current password incorrect'); return; }
    if (!newPw || newPw.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    updateUser(user.id, { password: newPw });
    setCurrentPw('');
    setNewPw('');
    toast.success('Password changed');
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account details</p>
      </div>

      <div className="max-w-lg space-y-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xl font-bold text-primary">{user.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role} · {user.department}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div><Label>Full Name</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
            <div><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1" /></div>
            <div><Label>Role</Label><Input value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} disabled className="mt-1" /></div>
            <div><Label>Department</Label><Input value={user.department} disabled className="mt-1" /></div>
            <div><Label>Member Since</Label><Input value={new Date(user.createdAt).toLocaleDateString()} disabled className="mt-1" /></div>
            <Button onClick={handleUpdate}>Save Changes</Button>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Change Password</h3>
          <div className="space-y-4">
            <div><Label>Current Password</Label><Input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="mt-1" /></div>
            <div><Label>New Password</Label><Input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} className="mt-1" /></div>
            <Button onClick={handlePasswordChange} variant="outline">Change Password</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
