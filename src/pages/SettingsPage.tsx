import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">System preferences and configuration</p>
      </div>

      <div className="max-w-lg space-y-6">
        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">General Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="text-sm font-medium text-foreground">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive email alerts for project updates</p>
              </div>
              <div className="h-5 w-9 bg-primary rounded-full relative cursor-pointer">
                <div className="h-4 w-4 bg-primary-foreground rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b">
              <div>
                <p className="text-sm font-medium text-foreground">Deadline Reminders</p>
                <p className="text-xs text-muted-foreground">Get notified before project deadlines</p>
              </div>
              <div className="h-5 w-9 bg-primary rounded-full relative cursor-pointer">
                <div className="h-4 w-4 bg-primary-foreground rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Auto Escalation</p>
                <p className="text-xs text-muted-foreground">Automatically escalate overdue projects</p>
              </div>
              <div className="h-5 w-9 bg-primary rounded-full relative cursor-pointer">
                <div className="h-4 w-4 bg-primary-foreground rounded-full absolute top-0.5 right-0.5" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">Account</h3>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Logged in as:</span> <span className="font-medium">{user.email}</span></p>
            <p><span className="text-muted-foreground">Role:</span> <span className="font-medium capitalize">{user.role}</span></p>
            <p><span className="text-muted-foreground">Department:</span> <span className="font-medium">{user.department}</span></p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
