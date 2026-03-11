'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Users, Star } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageOrders, storageProducts, storageUsers } from '@/lib/storage';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const [stats, setStats] = useState({
    totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, topCustomer: '',
    fashionRevenue: 0, techRevenue: 0,
    topProducts: [] as { name: string; sales: number; revenue: number }[],
    ordersByDay: [] as { day: string; orders: number }[],
  });

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    const orders = storageOrders.get();
    const products = storageProducts.get();
    const users = storageUsers.get();

    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    // Top customer by spend
    const spendByUser: Record<string, number> = {};
    orders.forEach(o => { spendByUser[o.customerName] = (spendByUser[o.customerName] ?? 0) + o.total; });
    const topCustomer = Object.entries(spendByUser).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'N/A';

    // Revenue by category
    const fashionRevenue = orders.reduce((s, o) => {
      const items = o.items.filter(i => {
        const p = products.find(p => p.id === i.productId);
        return p?.category === 'fashion';
      });
      return s + items.reduce((ss, i) => ss + i.price * i.quantity, 0);
    }, 0);
    const techRevenue = totalRevenue - fashionRevenue;

    // Top 5 products
    const salesByProduct: Record<string, { name: string; sales: number; revenue: number }> = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        if (!salesByProduct[i.productId]) salesByProduct[i.productId] = { name: i.name, sales: 0, revenue: 0 };
        salesByProduct[i.productId].sales += i.quantity;
        salesByProduct[i.productId].revenue += i.price * i.quantity;
      });
    });
    const topProducts = Object.values(salesByProduct).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Orders by day (last 7 days)
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const ordersByDay = DAYS.map((day, i) => {
      const count = orders.filter(o => new Date(o.createdAt).getDay() === i).length;
      return { day, orders: count };
    });

    setStats({ totalRevenue, totalOrders, avgOrderValue, topCustomer, fashionRevenue, techRevenue, topProducts, ordersByDay });
    setReady(true);
  }, [isAdminLoggedIn, router]);

  const STATS = [
    { icon: TrendingUp, label: 'Total Revenue', value: formatPrice(stats.totalRevenue), color: '#C9A84C' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.totalOrders.toString(), color: '#3B82F6' },
    { icon: Users, label: 'Avg Order Value', value: formatPrice(stats.avgOrderValue), color: '#22C55E' },
    { icon: Star, label: 'Top Customer', value: stats.topCustomer, color: '#F59E0B' },
  ];

  const maxDay = Math.max(...stats.ordersByDay.map(d => d.orders), 1);
  const totalCatRevenue = stats.fashionRevenue + stats.techRevenue;

  return (
    <div className="p-8">
      <h1 className="font-headline text-4xl mb-8">Analytics <em>Overview</em></h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
            transition={{ delay: i * 0.1 }}
            className="card p-5"
          >
            <div className="w-10 h-10 rounded-full border flex items-center justify-center mb-3" style={{ borderColor: `${color}40` }}>
              <Icon size={18} style={{ color }} />
            </div>
            <p className="font-headline text-2xl mb-1 truncate" style={{ color }}>{value}</p>
            <p className="font-body text-xs text-[#555] uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue by Category */}
        <div className="card p-6">
          <h2 className="font-headline text-2xl mb-6">Revenue by <em>Category</em></h2>
          <div className="space-y-4">
            {[
              { label: 'Fashion', revenue: stats.fashionRevenue, color: '#C9A84C' },
              { label: 'Tech', revenue: stats.techRevenue, color: '#3B82F6' },
            ].map(({ label, revenue, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-2">
                  <span className="font-body text-sm text-[#888]">{label}</span>
                  <span className="font-headline text-lg" style={{ color }}>{formatPrice(revenue)}</span>
                </div>
                <div className="h-3 bg-[#1C1C1C] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalCatRevenue ? (revenue / totalCatRevenue) * 100 : 0}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Day */}
        <div className="card p-6">
          <h2 className="font-headline text-2xl mb-6">Orders by <em>Day</em></h2>
          <div className="flex items-end gap-3 h-32">
            {stats.ordersByDay.map(({ day, orders: count }) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <span className="font-body text-[9px] text-[#888]">{count}</span>
                <motion.div
                  className="w-full bg-[#C9A84C] rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height: `${(count / maxDay) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{ minHeight: count > 0 ? 4 : 0 }}
                />
                <span className="font-body text-[9px] text-[#555]">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="card p-6">
        <h2 className="font-headline text-2xl mb-4">Top <em>Products</em></h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.05)]">
                <th className="pb-3 text-left font-body text-[10px] uppercase tracking-wider text-[#555]">#</th>
                <th className="pb-3 text-left font-body text-[10px] uppercase tracking-wider text-[#555]">Product</th>
                <th className="pb-3 text-left font-body text-[10px] uppercase tracking-wider text-[#555]">Units Sold</th>
                <th className="pb-3 text-right font-body text-[10px] uppercase tracking-wider text-[#555]">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((p, i) => (
                <tr key={p.name} className="border-b border-[rgba(255,255,255,0.04)]">
                  <td className="py-3 font-body text-sm text-[#555]">{i + 1}</td>
                  <td className="py-3 font-body text-sm">{p.name}</td>
                  <td className="py-3 font-body text-sm text-[#888]">{p.sales}</td>
                  <td className="py-3 text-right font-headline text-base text-[#C9A84C]">{formatPrice(p.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
