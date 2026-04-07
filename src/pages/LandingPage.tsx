import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Shield, ArrowRight, BarChart3, AlertTriangle, Users, FolderKanban, CheckCircle, Clock } from 'lucide-react';

const features = [
  { icon: FolderKanban, title: 'Project Management', desc: 'Create, assign, and track projects with full lifecycle management' },
  { icon: AlertTriangle, title: 'Escalation Handling', desc: 'Automatic and manual escalation when deadlines are missed' },
  { icon: BarChart3, title: 'Reports & Analytics', desc: 'Comprehensive reports with charts and visual insights' },
  { icon: Users, title: 'Role-Based Access', desc: 'Admin, Manager, and Employee dashboards with specific permissions' },
  { icon: Clock, title: 'Deadline Tracking', desc: 'Monitor upcoming and missed deadlines with smart reminders' },
  { icon: CheckCircle, title: 'Progress Monitoring', desc: 'Real-time progress tracking with visual indicators' },
];

const roles = [
  { role: 'Admin', desc: 'Full system control — manage all projects, users, escalations, and reports', color: 'bg-primary/10 text-primary' },
  { role: 'Manager', desc: 'Monitor assigned projects, manage team members, handle escalations', color: 'bg-success/10 text-success' },
  { role: 'Employee', desc: 'View assigned projects, update progress, request escalations', color: 'bg-info/10 text-info' },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">PEMS</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate('/login')}>Sign In</Button>
            <Button onClick={() => navigate('/login')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Project Escalation Management
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight max-w-3xl mx-auto">
              Web-Based Project Escalation Management System
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              A smart platform to monitor projects, track progress, manage deadlines, and handle escalations efficiently.
            </p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <Button size="lg" onClick={() => navigate('/login')} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">Key Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need to manage projects and escalations effectively</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground">Role-Based Workflow</h2>
            <p className="text-muted-foreground mt-2">Each role has a dedicated dashboard and specific capabilities</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {roles.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-card border rounded-xl p-6 text-center">
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${r.color} mb-4`}>{r.role}</span>
                <p className="text-sm text-muted-foreground">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground">Why PEMS?</h2>
          <p className="text-muted-foreground mt-2 mb-10">Built for organizations that need reliable project monitoring and escalation handling</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Real-time Monitoring', 'Auto Escalation', 'Smart Reports', 'Team Collaboration'].map((b, i) => (
              <div key={i} className="bg-card border rounded-xl p-5">
                <CheckCircle className="h-6 w-6 text-success mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground">Ready to Get Started?</h2>
          <p className="text-muted-foreground mt-3">Start managing your projects and escalations today.</p>
          <Button size="lg" className="mt-8 gap-2" onClick={() => navigate('/login')}>
            Login to Dashboard <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">PEMS</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2025 Project Escalation Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
