import React, { useState } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { ProjectTable } from '@/components/ProjectTable';
import { ProjectModal } from '@/components/ProjectModal';
import { useProjectContext } from '@/context/ProjectContext';
import { useAuth } from '@/context/AuthContext';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProjectsPageProps {
  roleFilter?: 'admin' | 'manager' | 'employee';
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ roleFilter = 'admin' }) => {
  const { projects, addProject, updateProject, deleteProject } = useProjectContext();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const filteredProjects = roleFilter === 'manager'
    ? projects.filter(p => p.managerId === user?.id)
    : roleFilter === 'employee'
    ? projects.filter(p => p.teamMembers.includes(user?.id || ''))
    : projects;

  const handleSave = (data: Partial<Project>) => {
    if (editing) updateProject(editing.id, data);
    else addProject(data as any);
    setEditing(null);
  };

  const title = roleFilter === 'manager' ? 'My Projects' : roleFilter === 'employee' ? 'My Projects' : 'Project Management';

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
          </p>
        </div>
        {roleFilter === 'admin' && (
          <Button onClick={() => { setEditing(null); setModalOpen(true); }} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        )}
      </div>
      <ProjectTable
        projects={filteredProjects}
        onEdit={roleFilter !== 'employee' ? (p) => { setEditing(p); setModalOpen(true); } : undefined}
        onDelete={roleFilter === 'admin' ? deleteProject : undefined}
        showActions={roleFilter !== 'employee'}
      />
      <ProjectModal open={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} onSave={handleSave} project={editing} />
    </DashboardLayout>
  );
};

export default ProjectsPage;
