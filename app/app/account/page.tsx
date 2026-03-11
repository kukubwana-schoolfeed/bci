'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getTierColor } from '@/lib/utils';
import Link from 'next/link';

type Tab = 'profile' | 'orders' | 'addresses' | 'settings';

export default function AccountPage() {
  const { user, isLoggedIn, login, register, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('profile');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = login(email, password);
    if (!ok) setError('Invalid email or password. Try demo@bci.zm / demo1234');
    else setError('');
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const ok = register(name, email, phone, password);
    if (!ok) setError('An account with this email already exists.');
    else setError('');
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] px-4 py-8">
        <div className="max-w-sm mx-auto">
          <h1 className="font-headline text-3xl mb-2 text-center">
            {mode === 'login' ? 'Sign <em>In</em>' : 'Create <em>Account</em>'}
          </h1>
          <p className="font-body text-xs text-center text-[#888] mb-8">
            {mode === 'login' ? 'Demo: demo@bci.zm / demo1234' : 'Join BCI and earn Royalty Points'}
          </p>

          <div className="flex mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 font-body text-[10px] font-bold tracking-[0.2em] uppercase border-b-2 transition-all ${
                mode === 'login' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-[#555]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-3 font-body text-[10px] font-bold tracking-[0.2em] uppercase border-b-2 transition-all ${
                mode === 'register' ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-[#555]'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {mode === 'register' && (
              <>
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" required className="input-gold" />
                </div>
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+260 977 000 000" required className="input-gold" />
                </div>
              </>
            )}
            <div>
              <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" required className="input-gold" />
            </div>
            <div>
              <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="input-gold pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="font-body text-xs text-[#EF4444]">{error}</p>
            )}
            <button type="submit" className="btn-primary w-full justify-center py-4 mt-2">
              {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'} <ChevronRight size={14} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Logged in
  const TABS = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'orders' as Tab, label: 'Orders', icon: Package },
    { id: 'addresses' as Tab, label: 'Addresses', icon: MapPin },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#0D0D0D] px-4 pt-8 pb-4 border-b border-[rgba(201,168,76,0.15)]">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center text-black text-2xl font-bold font-headline">
            {user!.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="font-headline text-2xl">{user!.name}</h1>
            <p className="font-body text-xs text-[#888]">{user!.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="font-body text-[9px] font-bold tracking-wider uppercase px-2 py-0.5"
                style={{ background: getTierColor(user!.loyaltyTier), color: '#000' }}
              >
                {user!.loyaltyTier}
              </span>
              <span className="font-body text-xs text-[#C9A84C]">{user!.loyaltyPoints.toLocaleString()} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-[rgba(201,168,76,0.15)]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 flex-shrink-0 font-body text-[10px] font-bold tracking-[0.15em] uppercase border-b-2 transition-all ${
              tab === id ? 'border-[#C9A84C] text-[#C9A84C]' : 'border-transparent text-[#555]'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <div className="px-4 py-6">
        {tab === 'profile' && (
          <div className="space-y-4">
            <div className="card p-4">
              <h3 className="font-headline text-lg mb-4">Personal Info</h3>
              <div className="space-y-3">
                {[
                  { label: 'Full Name', value: user!.name },
                  { label: 'Email', value: user!.email },
                  { label: 'Phone', value: user!.phone },
                  { label: 'Member Since', value: new Date(user!.createdAt).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="font-body text-xs text-[#555] uppercase tracking-wider">{label}</span>
                    <span className="font-body text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <Link href="/app/loyalty" className="card p-4 flex items-center justify-between">
              <span className="font-headline text-lg">View <em>Loyalty Points</em></span>
              <ChevronRight size={16} className="text-[#C9A84C]" />
            </Link>
          </div>
        )}

        {tab === 'orders' && (
          <div className="text-center py-8">
            <p className="font-body text-sm text-[#888] mb-4">View your complete order history</p>
            <Link href="/app/orders" className="btn-primary inline-flex">
              VIEW ALL ORDERS <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {tab === 'addresses' && (
          <div className="space-y-3">
            {user!.addresses.length === 0 ? (
              <p className="font-body text-sm text-[#888] text-center py-8">No saved addresses yet</p>
            ) : (
              user!.addresses.map(addr => (
                <div key={addr.id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-body text-xs font-bold tracking-wider uppercase text-[#C9A84C] mb-1">{addr.label}</p>
                      <p className="font-body text-sm">{addr.street}</p>
                      <p className="font-body text-sm text-[#888]">{addr.area}, {addr.city}</p>
                    </div>
                    {addr.isDefault && (
                      <span className="badge badge-outline text-[8px]">DEFAULT</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="space-y-3">
            <div className="card p-4">
              <h3 className="font-headline text-lg mb-3">Preferences</h3>
              {['Push notifications', 'Email updates', 'Flash sale alerts'].map(pref => (
                <div key={pref} className="flex items-center justify-between py-2 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                  <span className="font-body text-sm text-[#888]">{pref}</span>
                  <div className="w-10 h-6 bg-[#C9A84C] rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-black rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-4 border border-[rgba(239,68,68,0.3)] text-[#EF4444] font-body text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[rgba(239,68,68,0.05)] transition-colors"
            >
              <LogOut size={16} />
              SIGN OUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
