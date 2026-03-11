'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Check } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageStaff } from '@/lib/storage';
import { StaffMember, StaffRole } from '@/lib/types';
import { generateId, formatDate } from '@/lib/utils';

const ROLE_COLORS: Record<StaffRole, string> = {
  owner: '#C9A84C',
  manager: '#3B82F6',
  sales: '#22C55E',
  inventory: '#F59E0B',
};

const PERMISSIONS = ['orders', 'inventory', 'customers', 'analytics', 'broadcasts', 'staff', 'inbox'];

const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  owner: PERMISSIONS,
  manager: ['orders', 'inventory', 'customers', 'analytics', 'broadcasts', 'inbox'],
  sales: ['orders', 'customers', 'inbox'],
  inventory: ['inventory'],
};

export default function AdminStaffPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'sales' as StaffRole });

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setStaff(storageStaff.get());
  }, [isAdminLoggedIn, router]);

  function addStaff(e: React.FormEvent) {
    e.preventDefault();
    const permissions: Record<string, boolean> = {};
    PERMISSIONS.forEach(p => { permissions[p] = ROLE_PERMISSIONS[form.role].includes(p); });
    const member: StaffMember = {
      id: generateId(),
      name: form.name,
      email: form.email,
      role: form.role,
      lastActive: 'Never',
      status: 'active',
      permissions,
    };
    storageStaff.add(member);
    setStaff(storageStaff.get());
    setShowAdd(false);
    setForm({ name: '', email: '', role: 'sales' });
  }

  function removeStaff(id: string) {
    storageStaff.remove(id);
    setStaff(storageStaff.get());
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-4xl">Staff <em>Management</em></h1>
        <button onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={14} /> ADD STAFF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map(member => (
          <div key={member.id} className="card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-black"
                  style={{ background: ROLE_COLORS[member.role] }}>
                  {member.name[0]}
                </div>
                <div>
                  <h3 className="font-headline text-lg">{member.name}</h3>
                  <p className="font-body text-xs text-[#888]">{member.email}</p>
                </div>
              </div>
              {member.role !== 'owner' && (
                <button
                  onClick={() => removeStaff(member.id)}
                  className="text-[#555] hover:text-[#EF4444] transition-colors p-1"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-4">
              <span
                className="font-body text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1"
                style={{ background: ROLE_COLORS[member.role], color: '#000' }}
              >
                {member.role}
              </span>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${member.status === 'active' ? 'bg-[#22C55E]' : 'bg-[#555]'}`} />
                <span className="font-body text-xs text-[#555]">{member.lastActive}</span>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <p className="font-body text-[9px] font-bold uppercase tracking-wider text-[#555] mb-2">Permissions</p>
              <div className="grid grid-cols-2 gap-1">
                {PERMISSIONS.map(p => {
                  const allowed = member.permissions[p];
                  return (
                    <div key={p} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-sm flex items-center justify-center ${allowed ? 'bg-[#22C55E]/20' : 'bg-[#1C1C1C]'}`}>
                        {allowed && <Check size={8} className="text-[#22C55E]" />}
                      </div>
                      <span className={`font-body text-[9px] capitalize ${allowed ? 'text-[#888]' : 'text-[#444]'}`}>{p}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Staff Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-[#111] border border-[rgba(201,168,76,0.2)] w-full max-w-md p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl">Add <em>Staff Member</em></h2>
                <button onClick={() => setShowAdd(false)}><X size={20} className="text-[#555]" /></button>
              </div>
              <form onSubmit={addStaff} className="space-y-4">
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Full Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Staff member's name" className="input-gold" />
                </div>
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Email</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="staff@bci.zm" className="input-gold" />
                </div>
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['manager', 'sales', 'inventory'] as StaffRole[]).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForm({...form, role})}
                        className={`py-3 font-body text-[9px] font-bold tracking-wider uppercase border transition-all ${
                          form.role === role ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)]' : 'border-[rgba(255,255,255,0.08)] text-[#555]'
                        }`}
                        style={form.role === role ? { color: ROLE_COLORS[role] } : {}}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Role permissions preview */}
                <div className="bg-[#0A0A0A] p-3">
                  <p className="font-body text-[9px] uppercase tracking-wider text-[#555] mb-2">Permissions for {form.role}</p>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_PERMISSIONS[form.role].map(p => (
                      <span key={p} className="font-body text-[8px] uppercase tracking-wider text-[#22C55E] border border-[rgba(34,197,94,0.2)] px-1.5 py-0.5 flex items-center gap-1">
                        <Check size={8} /> {p}
                      </span>
                    ))}
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center">ADD STAFF MEMBER</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
