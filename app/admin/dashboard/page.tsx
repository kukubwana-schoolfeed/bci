'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Users, TrendingUp, AlertTriangle, Plus, Radio, MessageSquare } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageOrders, storageProducts, storageUsers } from '@/lib/storage';
import { Order, Product } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { adminUser, isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setOrders(storageOrders.get());
    setProducts(storageProducts.get());
    setUserCount(storageUsers.get().length);
  }, [isAdminLoggedIn, router]);

  const todayOrders = orders.filter(o => {
    const d = new Date(o.createdAt);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const lowStock = products.filter(p => p.stock < 5);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const STATS = [
    { icon: TrendingUp, value: formatPrice(todayRevenue), sub: "Today's Revenue", color: '#C9A84C' },
    { icon: ShoppingBag, value: todayOrders.length.toString(), sub: 'Orders Today', color: '#3B82F6' },
    { icon: Users, value: userCount.toString(), sub: 'Active Customers', color: '#22C55E' },
    { icon: AlertTriangle, value: lowStock.length.toString(), sub: 'Low Stock Items', color: '#EF4444' },
  ];

  const QUICK_ACTIONS = [
    { icon: Plus, label: 'Add Product', href: '/admin/inventory' },
    { icon: Radio, label: 'Send Broadcast', href: '/admin/broadcast' },
    { icon: MessageSquare, label: 'View Inbox', href: '/admin/inbox' },
    { icon: ShoppingBag, label: 'New Order', href: '/admin/orders' },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="font-body text-sm text-[#888]">{greeting},</p>
        <h1 className="font-headline text-4xl">
          <em className="text-[#C9A84C]">{adminUser?.name?.split(' ')[0]}</em>
        </h1>
        <p className="font-body text-xs text-[#555] mt-1 uppercase tracking-wider">{adminUser?.role}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ icon: Icon, value, sub, color }, idx) => (
          <motion.div
            key={sub}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: `${color}40` }}>
                <Icon size={18} style={{ color }} />
              </div>
            </div>
            <p className="font-headline text-3xl mb-1" style={{ color }}>{value}</p>
            <p className="font-body text-xs text-[#555] uppercase tracking-wider">{sub}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Orders Feed */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline text-2xl">Live <em>Orders</em></h2>
            <Link href="/admin/orders" className="font-body text-[10px] font-bold tracking-[0.15em] uppercase text-[#C9A84C]">
              VIEW ALL
            </Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-[rgba(255,255,255,0.04)] last:border-0">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-body text-xs font-bold text-[#C9A84C]">{order.ref}</p>
                    <p className="font-body text-xs text-[#888]">{order.customerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-headline text-sm">{formatPrice(order.total)}</span>
                  <span className={`font-body text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                    order.status === 'delivered' ? 'text-[#22C55E] border-[rgba(34,197,94,0.3)]' :
                    order.status === 'dispatched' ? 'text-[#3B82F6] border-[rgba(59,130,246,0.3)]' :
                    order.status === 'processing' ? 'text-[#F59E0B] border-[rgba(245,158,11,0.3)]' :
                    'text-[#888] border-[rgba(136,136,136,0.3)]'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-headline text-2xl mb-4">Quick <em>Actions</em></h2>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-2 p-4 border border-[rgba(201,168,76,0.15)] hover:border-[#C9A84C] hover:bg-[rgba(201,168,76,0.05)] transition-all text-center"
              >
                <Icon size={20} className="text-[#C9A84C]" />
                <span className="font-body text-[9px] font-bold tracking-[0.15em] uppercase text-[#888]">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
