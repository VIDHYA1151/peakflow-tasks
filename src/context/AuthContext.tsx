import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { initialUsers } from '@/data/initialData';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  removeUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: UserRole) => User[];
  getUsersByTeam: (team: string) => User[];
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('tes_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tes_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('tes_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (user) localStorage.setItem('tes_current_user', JSON.stringify(user));
    else localStorage.removeItem('tes_current_user');
  }, [user]);

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) { setUser(found); return true; }
    return false;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const addUser = useCallback((data: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...data,
      id: `u${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers(prev => [...prev, newUser]);
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  const getUserById = useCallback((id: string) => users.find(u => u.id === id), [users]);
  const getUsersByRole = useCallback((role: UserRole) => users.filter(u => u.role === role), [users]);
  const getUsersByTeam = useCallback((team: string) => users.filter(u => u.team === team), [users]);

  return (
    <AuthContext.Provider value={{ user, users, login, logout, addUser, removeUser, getUserById, getUsersByRole, getUsersByTeam }}>
      {children}
    </AuthContext.Provider>
  );
};
