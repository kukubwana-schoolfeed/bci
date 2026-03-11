'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ChevronRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export default function AdminLoginPage() {
  const { adminLogin, isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  if (isAdminLoggedIn) {
    router.replace('/admin/dashboard');
    return null;
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const ok = adminLogin(email, password);
    if (!ok) {
      setError('Invalid credentials. Try admin@bci.zm / admin2025');
    } else {
      setError('');
      router.push('/admin/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/images/photo-8.jpg" alt="Background" fill className="object-cover opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]/80" />
      </div>
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[#C9A84C] opacity-5 blur-[100px]" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border border-[rgba(201,168,76,0.4)]">
            <Image src="/images/photo-1.jpg" alt="BCI" width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <p className="font-body text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]">BRIAN CHANDA INNOVATIONS</p>
          <div className="inline-block mt-3 font-body text-[9px] font-bold tracking-[0.25em] uppercase text-black bg-[#C9A84C] px-3 py-1">
            STAFF ACCESS ONLY
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-8"
        >
          <h1 className="font-headline text-3xl mb-6 text-center">Admin <em>Portal</em></h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@bci.zm"
                required
                className="input-gold"
              />
            </div>
            <div>
              <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-gold pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555]">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="font-body text-xs text-[#EF4444]">{error}</p>}
            <button type="submit" className="btn-primary w-full justify-center py-4 mt-2">
              SIGN IN <ChevronRight size={14} />
            </button>
          </form>

          <p className="font-body text-xs text-center text-[#333] mt-6">
            Demo: admin@bci.zm / admin2025
          </p>
        </motion.div>
      </div>
    </div>
  );
}
