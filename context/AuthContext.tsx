'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { storageUser, storageUsers } from '@/lib/storage';
import { getLoyaltyTier, generateReferralCode, generateId } from '@/lib/utils';

interface AuthContextValue {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  loginAsDemo: () => void;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
  addLoyaltyPoints: (points: number, description: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = storageUser.get();
    if (saved) setUser(saved);
  }, []);

  function save(u: User | null) {
    setUser(u);
    if (u) storageUser.set(u);
    else storageUser.clear();
  }

  function login(email: string, password: string): boolean {
    const users = storageUsers.get();
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      save(found);
      return true;
    }
    return false;
  }

  function loginAsDemo() {
    const users = storageUsers.get();
    const demo = users.find(u => u.email === 'demo@bci.zm');
    if (demo) save(demo);
  }

  function logout() {
    save(null);
  }

  function register(name: string, email: string, phone: string, password: string): boolean {
    const users = storageUsers.get();
    if (users.find(u => u.email === email)) return false;
    const newUser: User = {
      id: generateId(),
      name, email, phone, password,
      loyaltyPoints: 0,
      loyaltyTier: 'Bronze',
      referralCode: generateReferralCode(name),
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    storageUsers.set(updated);
    save(newUser);
    return true;
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    save(updated);
    storageUsers.update(user.id, updates);
  }

  function addLoyaltyPoints(points: number, _description: string) {
    if (!user) return;
    const newPoints = user.loyaltyPoints + points;
    const newTier = getLoyaltyTier(newPoints);
    updateUser({ loyaltyPoints: newPoints, loyaltyTier: newTier });
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, loginAsDemo, logout, register, updateUser, addLoyaltyPoints }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
