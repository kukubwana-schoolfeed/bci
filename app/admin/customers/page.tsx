'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageUsers, storageOrders } from '@/lib/storage';
import { User, Order } from '@/lib/types';
import { formatPrice, formatDate, getTierColor } from '@/lib/utils';

export default function AdminCustomersPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [detail, setDetail] = useState<User | null>(null);
  const [userOrders, setUserOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setUsers(storageUsers.get());
  }, [isAdminLoggedIn, router]);

  function viewDetail(user: User) {
    setDetail(user);
    setUserOrders(storageOrders.get().filter(o => o.userId === user.id));
  }

  const totalSpend = (userId: string) =>
    storageOrders.get().filter(o => o.userId === userId).reduce((s, o) => s + o.total, 0);
  const orderCount = (userId: string) =>
    storageOrders.get().filter(o => o.userId === userId).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-4xl">Customer <em>Accounts</em></h1>
        <span className="font-body text-xs text-[#555]">{users.length} registered customers</span>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                {['Name', 'Phone', 'Email', 'Orders', 'Spend', 'Tier', 'Joined'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-body text-[10px] font-bold tracking-[0.15em] uppercase text-[#555]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr
                  key={user.id}
                  onClick={() => viewDetail(user)}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#161616] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-black text-xs font-bold"
                        style={{ background: getTierColor(user.loyaltyTier) }}>
                        {user.name[0]}
                      </div>
                      <span className="font-body text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-[#888]">{user.phone}</td>
                  <td className="px-4 py-3 font-body text-sm text-[#888]">{user.email}</td>
                  <td className="px-4 py-3 font-body text-sm">{orderCount(user.id)}</td>
                  <td className="px-4 py-3 font-headline text-sm text-[#C9A84C]">{formatPrice(totalSpend(user.id))}</td>
                  <td className="px-4 py-3">
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider px-2 py-0.5"
                      style={{ background: getTierColor(user.loyaltyTier), color: '#000' }}>
                      {user.loyaltyTier}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-[#555]">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="fixed right-0 top-0 bottom-0 w-96 bg-[#111] border-l border-[rgba(201,168,76,0.2)] overflow-y-auto z-50 shadow-2xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-headline text-2xl">Customer <em>Details</em></h2>
                <button onClick={() => setDetail(null)} className="text-[#555] hover:text-[#888]"><X size={20} /></button>
              </div>
              {/* Profile */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-black"
                  style={{ background: getTierColor(detail.loyaltyTier) }}>
                  {detail.name[0]}
                </div>
                <div>
                  <h3 className="font-headline text-xl">{detail.name}</h3>
                  <p className="font-body text-xs text-[#888]">{detail.email}</p>
                  <span className="font-body text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 mt-1 inline-block"
                    style={{ background: getTierColor(detail.loyaltyTier), color: '#000' }}>
                    {detail.loyaltyTier}
                  </span>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between"><span className="font-body text-xs text-[#555]">Points</span><span className="font-headline text-lg text-[#C9A84C]">{detail.loyaltyPoints.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="font-body text-xs text-[#555]">Orders</span><span className="font-body text-sm">{userOrders.length}</span></div>
                <div className="flex justify-between"><span className="font-body text-xs text-[#555]">Total Spend</span><span className="font-headline text-base">{formatPrice(userOrders.reduce((s, o) => s + o.total, 0))}</span></div>
                <div className="flex justify-between"><span className="font-body text-xs text-[#555]">Joined</span><span className="font-body text-sm">{formatDate(detail.createdAt)}</span></div>
              </div>
              {/* Orders */}
              <h3 className="font-headline text-lg mb-3">Order History</h3>
              <div className="space-y-2">
                {userOrders.map(o => (
                  <div key={o.id} className="p-3 bg-[#0A0A0A] border border-[rgba(255,255,255,0.05)]">
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-xs font-bold text-[#C9A84C]">{o.ref}</span>
                      <span className="font-headline text-sm">{formatPrice(o.total)}</span>
                    </div>
                    <p className="font-body text-xs text-[#555]">{formatDate(o.createdAt)} · {o.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
