'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { storageAdminUser } from '@/lib/storage';

interface AdminUser {
  email: string;
  role: 'owner' | 'manager' | 'sales' | 'inventory';
  name: string;
}

interface AdminContextValue {
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => boolean;
  adminLogout: () => void;
  setAdminRole: (role: AdminUser['role']) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

const ADMIN_CREDENTIALS = [
  { email: 'admin@bci.zm', password: 'admin2025', name: 'Brian Chanda', role: 'owner' as const },
  { email: 'manager@bci.zm', password: 'manager2025', name: 'Chanda Mwale', role: 'manager' as const },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const saved = storageAdminUser.get();
    if (saved) setAdminUser(saved as AdminUser);
  }, []);

  function adminLogin(email: string, password: string): boolean {
    const match = ADMIN_CREDENTIALS.find(c => c.email === email && c.password === password);
    if (match) {
      const admin: AdminUser = { email: match.email, role: match.role, name: match.name };
      setAdminUser(admin);
      storageAdminUser.set(admin);
      return true;
    }
    return false;
  }

  function adminLogout() {
    setAdminUser(null);
    storageAdminUser.clear();
  }

  function setAdminRole(role: AdminUser['role']) {
    if (!adminUser) return;
    const updated = { ...adminUser, role };
    setAdminUser(updated);
    storageAdminUser.set(updated);
  }

  return (
    <AdminContext.Provider value={{ adminUser, isAdminLoggedIn: !!adminUser, adminLogin, adminLogout, setAdminRole }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
