import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(email, password);
    if (success) {
      const users = JSON.parse(localStorage.getItem('pems_users') || '[]');
      const user = users.find((u: any) => u.email === email);
      if (user?.role === 'admin') navigate('/admin');
      else if (user?.role === 'manager') navigate('/manager');
      else navigate('/employee');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 items-center justify-center p-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold text-foreground">PEMS</span>
          </div>
          <h2 className="text-3xl font-bold text-foreground leading-tight">Project Escalation Management System</h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Monitor projects, track progress, manage deadlines, and handle escalations efficiently with our comprehensive platform.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>

          <div className="lg:hidden flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">PEMS</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1 mb-8">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="mt-1.5" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
              </div>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className="mt-1.5" />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" size="lg">Sign In</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
