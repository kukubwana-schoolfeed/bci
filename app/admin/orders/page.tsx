'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronRight, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageOrders } from '@/lib/storage';
import { Order, OrderStatus } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';

const STATUSES: OrderStatus[] = ['received', 'processing', 'dispatched', 'delivered'];
const STATUS_COLORS: Record<string, string> = {
  received: '#888',
  processing: '#F59E0B',
  dispatched: '#3B82F6',
  delivered: '#22C55E',
};

export default function AdminOrdersPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
  const [detail, setDetail] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setOrders(storageOrders.get());
  }, [isAdminLoggedIn, router]);

  function updateStatus(id: string, status: OrderStatus) {
    storageOrders.updateStatus(id, status);
    const updated = storageOrders.get();
    setOrders(updated);
    if (detail?.id === id) setDetail(updated.find(o => o.id === id) ?? null);
  }

  const filtered = orders.filter(o => {
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    const matchSearch = !search || o.ref.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-4xl">Orders <em>Management</em></h1>
        <span className="font-body text-xs text-[#555]">{orders.length} total orders</span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Search ref or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-gold pl-9 text-sm py-2.5 w-64"
          />
        </div>
        <div className="flex gap-2">
          {(['all', ...STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`font-body text-[9px] font-bold tracking-[0.15em] uppercase px-4 py-2 border transition-all ${
                filterStatus === s ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[rgba(255,255,255,0.08)] text-[#555] hover:text-[#888]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                {['Ref', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-body text-[10px] font-bold tracking-[0.15em] uppercase text-[#555]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr
                  key={order.id}
                  className="border-b border-[rgba(255,255,255,0.04)] hover:bg-[#161616] transition-colors cursor-pointer"
                  onClick={() => setDetail(order)}
                >
                  <td className="px-4 py-3 font-body text-xs font-bold text-[#C9A84C]">{order.ref}</td>
                  <td className="px-4 py-3 font-body text-sm">{order.customerName}</td>
                  <td className="px-4 py-3 font-body text-xs text-[#888]">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                  <td className="px-4 py-3 font-headline text-base">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 font-body text-xs uppercase tracking-wider text-[#888]">{order.paymentMethod}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => { e.stopPropagation(); updateStatus(order.id, e.target.value as OrderStatus); }}
                      onClick={e => e.stopPropagation()}
                      className="bg-transparent border border-[rgba(255,255,255,0.1)] font-body text-[10px] uppercase tracking-wider px-2 py-1 outline-none"
                      style={{ color: STATUS_COLORS[order.status] }}
                    >
                      {STATUSES.map(s => <option key={s} value={s} className="bg-[#111] text-[#F5F0E8]">{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 font-body text-xs text-[#555]">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    <ChevronRight size={14} className="text-[#555]" />
                  </td>
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
                <h2 className="font-headline text-2xl">Order <em>Details</em></h2>
                <button onClick={() => setDetail(null)} className="text-[#555] hover:text-[#888]">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-[#555] mb-1">Reference</p>
                  <p className="font-body text-sm font-bold text-[#C9A84C]">{detail.ref}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-[#555] mb-1">Customer</p>
                  <p className="font-body text-sm">{detail.customerName}</p>
                  <p className="font-body text-xs text-[#888]">{detail.customerPhone}</p>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-[#555] mb-2">Items</p>
                  {detail.items.map((item, i) => (
                    <div key={i} className="flex justify-between font-body text-sm py-1 border-b border-[rgba(255,255,255,0.04)]">
                      <span className="text-[#888]">{item.name} × {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-sm text-[#555]">Delivery</span>
                  <span className="font-body text-sm">{formatPrice(detail.deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-[rgba(201,168,76,0.15)] pt-3">
                  <span className="font-body text-sm font-bold">Total</span>
                  <span className="font-headline text-2xl text-[#C9A84C]">{formatPrice(detail.total)}</span>
                </div>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-wider text-[#555] mb-1">Update Status</p>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUSES.map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(detail.id, s)}
                        className={`font-body text-[9px] font-bold tracking-wider uppercase py-2 border transition-all ${
                          detail.status === s
                            ? 'border-[#C9A84C] bg-[rgba(201,168,76,0.1)] text-[#C9A84C]'
                            : 'border-[rgba(255,255,255,0.08)] text-[#555] hover:text-[#888]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
