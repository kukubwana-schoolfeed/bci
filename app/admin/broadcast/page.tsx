'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Send, Plus } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageBroadcasts, storageUsers } from '@/lib/storage';
import { Broadcast, BroadcastTarget, BroadcastChannel } from '@/lib/types';
import { generateId, formatDate, getEstimatedReach } from '@/lib/utils';

export default function AdminBroadcastPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    name: '', target: 'all' as BroadcastTarget, channel: 'in_app' as BroadcastChannel, message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<{ name: string; count: number } | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setBroadcasts(storageBroadcasts.get());
    setTotalUsers(storageUsers.get().length);
  }, [isAdminLoggedIn, router]);

  const estimatedReach = getEstimatedReach(form.target, totalUsers);

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      const broadcast: Broadcast = {
        id: generateId(),
        name: form.name,
        target: form.target,
        channel: form.channel,
        message: form.message,
        estimatedReach,
        actualReach: Math.floor(estimatedReach * (0.85 + Math.random() * 0.1)),
        openRate: Math.floor(55 + Math.random() * 30),
        sentAt: new Date().toISOString(),
        status: 'sent',
      };
      storageBroadcasts.add(broadcast);
      setBroadcasts(storageBroadcasts.get());
      setSent({ name: form.name, count: broadcast.actualReach });
      setSending(false);
      setShowNew(false);
      setForm({ name: '', target: 'all', channel: 'in_app', message: '' });
    }, 1500);
  }

  const TARGET_LABELS: Record<BroadcastTarget, string> = {
    all: 'All Users',
    gold_plus: 'Gold + Platinum',
    bronze: 'Bronze Members',
    custom: 'Custom Segment',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-4xl">Bulk <em>Broadcast</em></h1>
        <button onClick={() => setShowNew(!showNew)} className="btn-primary">
          <Plus size={14} /> NEW BROADCAST
        </button>
      </div>

      {/* Success toast */}
      <AnimatePresence>
        {sent && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 bg-[#22C55E]/10 border border-[#22C55E]/30 p-4 flex items-center gap-3"
          >
            <Radio size={20} className="text-[#22C55E]" />
            <div>
              <p className="font-body text-sm font-semibold text-[#22C55E]">Broadcast sent!</p>
              <p className="font-body text-xs text-[#888]">
                "{sent.name}" delivered to {sent.count} customers
              </p>
            </div>
            <button onClick={() => setSent(null)} className="ml-auto text-[#555] hover:text-[#888] text-sm">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Broadcast Form */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="card p-6 mb-6 overflow-hidden"
          >
            <h2 className="font-headline text-2xl mb-6">Create <em>Broadcast</em></h2>
            <form onSubmit={handleSend} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Campaign Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g. Weekend Flash Sale" className="input-gold" />
                </div>
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Target Audience</label>
                  <select value={form.target} onChange={e => setForm({...form, target: e.target.value as BroadcastTarget})} className="input-gold">
                    <option value="all">All Users ({totalUsers})</option>
                    <option value="gold_plus">Gold + Platinum Members</option>
                    <option value="bronze">Bronze Members</option>
                    <option value="custom">Custom Segment</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Channel</label>
                  <div className="flex gap-3">
                    {[{ val: 'in_app', label: 'In-App' }, { val: 'sms', label: 'SMS' }].map(c => (
                      <button
                        key={c.val}
                        type="button"
                        onClick={() => setForm({...form, channel: c.val as BroadcastChannel})}
                        className={`flex-1 py-3 font-body text-[10px] font-bold tracking-[0.15em] uppercase border transition-all ${
                          form.channel === c.val ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[rgba(255,255,255,0.08)] text-[#555]'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)]">
                  <p className="font-body text-[10px] uppercase tracking-wider text-[#C9A84C] mb-1">Estimated Reach</p>
                  <p className="font-headline text-3xl text-[#C9A84C]">{estimatedReach} customers</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">
                    Message <span className="text-[#333]">({form.message.length}/160)</span>
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value.slice(0, 160)})}
                    placeholder="Write your message here..."
                    rows={5}
                    className="input-gold resize-none"
                  />
                </div>

                {/* Preview */}
                {form.message && (
                  <div>
                    <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Preview</label>
                    <div className="bg-[#0A0A0A] border border-[rgba(201,168,76,0.15)] p-3 max-w-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#C9A84C] flex items-center justify-center">
                          <span className="text-[8px] font-bold text-black">BC</span>
                        </div>
                        <span className="font-body text-[9px] text-[#888]">Brian Chanda Innovations</span>
                      </div>
                      <p className="font-body text-xs text-[#F5F0E8]">{form.message}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary w-full justify-center py-4 disabled:opacity-60"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      SENDING...
                    </span>
                  ) : (
                    <><Send size={14} /> SEND BROADCAST →</>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Past Broadcasts */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(255,255,255,0.05)]">
          <h2 className="font-headline text-xl">Past <em>Broadcasts</em></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                {['Campaign', 'Target', 'Channel', 'Reach', 'Open Rate', 'Sent'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-wider text-[#555]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {broadcasts.map(b => (
                <tr key={b.id} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#161616] transition-colors">
                  <td className="px-4 py-3 font-body text-sm">{b.name}</td>
                  <td className="px-4 py-3 font-body text-xs text-[#888]">{TARGET_LABELS[b.target]}</td>
                  <td className="px-4 py-3 font-body text-xs uppercase tracking-wider text-[#888]">{b.channel}</td>
                  <td className="px-4 py-3 font-body text-sm">{b.actualReach.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className="font-body text-sm text-[#22C55E]">{b.openRate}%</span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-[#555]">{formatDate(b.sentAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
