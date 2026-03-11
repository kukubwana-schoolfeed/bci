'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Package, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { storageProducts, storageOrders, storageFlashSales } from '@/lib/storage';
import { Product, Order, FlashSale } from '@/lib/types';
import { formatPrice, formatDate, getTierColor } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

function useCountdown(endTime: string) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    function calc() {
      const diff = Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
      setSeconds(diff);
    }
    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [endTime]);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return { display: `${pad(h)}:${pad(m)}:${pad(s)}`, expired: seconds === 0 };
}

const CATEGORIES = ['ALL', 'FASHION', 'TECH', 'NEW ARRIVALS', 'SALE'];

export default function AppHomePage() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [activeFlashSale, setActiveFlashSale] = useState<FlashSale | null>(null);
  const [catFilter, setCatFilter] = useState('ALL');

  useEffect(() => {
    setProducts(storageProducts.get());
    const orders = user
      ? storageOrders.get().filter(o => o.userId === user.id).slice(0, 2)
      : storageOrders.get().slice(0, 2);
    setRecentOrders(orders);
    const sales = storageFlashSales.get().filter(s => s.isActive);
    setActiveFlashSale(sales[0] ?? null);
  }, [user]);

  const countdown = useCountdown(activeFlashSale?.endTime ?? new Date().toISOString());

  const featured = products.filter(p => {
    if (catFilter === 'ALL') return true;
    if (catFilter === 'FASHION') return p.category === 'fashion';
    if (catFilter === 'TECH') return p.category === 'tech';
    if (catFilter === 'NEW ARRIVALS') return p.badge.toLowerCase().includes('new');
    return true;
  }).slice(0, 6);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 bg-[#0D0D0D] border-b border-[rgba(201,168,76,0.15)]">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="font-body text-xs text-[#888]">{greeting},</p>
            <h1 className="font-headline text-2xl">
              {user ? <><em className="text-[#C9A84C]">{user.name.split(' ')[0]}</em></> : <em>Welcome</em>}
            </h1>
          </div>
          <Link href="/app/account">
            <div className="w-10 h-10 rounded-full bg-[#C9A84C] flex items-center justify-center text-black font-bold text-sm">
              {user ? user.name[0].toUpperCase() : 'G'}
            </div>
          </Link>
        </div>
        {user && (
          <div className="flex items-center gap-2 mt-2">
            <Star size={12} style={{ color: getTierColor(user.loyaltyTier) }} fill="currentColor" />
            <span className="font-body text-xs" style={{ color: getTierColor(user.loyaltyTier) }}>
              {user.loyaltyTier} · {user.loyaltyPoints.toLocaleString()} points
            </span>
          </div>
        )}
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* Flash Sale Banner */}
        {activeFlashSale && !countdown.expired && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-[#EF4444]/10 to-[#C9A84C]/10 border border-[rgba(239,68,68,0.3)] p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Zap size={20} className="text-[#EF4444]" />
              <div>
                <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#EF4444]">FLASH SALE</p>
                <p className="font-headline text-sm">{activeFlashSale.productName} — {activeFlashSale.percentOff}% OFF</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-body text-[8px] uppercase text-[#555] tracking-wider">Ends in</p>
              <p className="font-body text-lg font-bold text-[#EF4444] tabular-nums">{countdown.display}</p>
            </div>
          </motion.div>
        )}

        {/* Loyalty Points Card */}
        {user && (
          <Link href="/app/loyalty">
            <div className="loyalty-card p-5 flex items-center justify-between">
              <div>
                <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">
                  YOUR ROYALTY POINTS
                </p>
                <p className="font-headline text-4xl text-[#C9A84C]">
                  {user.loyaltyPoints.toLocaleString()}
                </p>
                <p className="font-body text-xs text-[#888] mt-1">{user.loyaltyTier} Member</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div
                  className="px-3 py-1 text-[9px] font-bold font-body tracking-wider uppercase"
                  style={{ background: getTierColor(user.loyaltyTier), color: '#000' }}
                >
                  {user.loyaltyTier}
                </div>
                <ChevronRight size={16} className="text-[#C9A84C]" />
              </div>
            </div>
          </Link>
        )}

        {/* Categories */}
        <div>
          <h2 className="font-headline text-xl mb-3">Shop by <em>Category</em></h2>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                className={`flex-shrink-0 font-body text-[9px] font-bold tracking-[0.15em] uppercase px-4 py-2 border transition-all ${
                  catFilter === cat
                    ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                    : 'bg-transparent text-[#888] border-[rgba(201,168,76,0.2)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-headline text-xl">Featured <em>Products</em></h2>
            <Link href="/app/shop" className="font-body text-[10px] font-bold tracking-[0.15em] uppercase text-[#C9A84C]">
              VIEW ALL
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {featured.map(product => (
              <div key={product.id} className="flex-shrink-0 w-44 card overflow-hidden">
                <Link href={`/app/shop/${product.id}`}>
                  <div className="relative h-40 bg-[#111]">
                    <Image src={product.image} alt={product.name} fill className="object-cover" />
                    {product.badge && (
                      <span className="absolute top-2 left-2 badge badge-gold text-[7px]">{product.badge}</span>
                    )}
                  </div>
                </Link>
                <div className="p-3">
                  <p className="font-headline text-sm leading-tight mb-1">{product.name}</p>
                  <p className="font-headline text-base text-[#C9A84C] mb-2">{formatPrice(product.price)}</p>
                  <button
                    onClick={() => addItem(product)}
                    className="w-full btn-primary text-[9px] py-2 justify-center"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-headline text-xl">Recent <em>Orders</em></h2>
              <Link href="/app/orders" className="font-body text-[10px] font-bold tracking-[0.15em] uppercase text-[#C9A84C]">
                VIEW ALL
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {recentOrders.map(order => (
                <Link key={order.id} href="/app/orders">
                  <div className="card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
                        <Package size={16} className="text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-body text-xs font-bold text-[#C9A84C]">{order.ref}</p>
                        <p className="font-body text-xs text-[#888]">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline text-base">{formatPrice(order.total)}</p>
                      <span className={`font-body text-[9px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'text-[#22C55E]' :
                        order.status === 'dispatched' ? 'text-[#3B82F6]' :
                        order.status === 'processing' ? 'text-[#F59E0B]' : 'text-[#888]'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Not logged in CTA */}
        {!user && (
          <div className="card p-6 text-center border-[rgba(201,168,76,0.3)]">
            <p className="font-headline text-2xl mb-2">Shop <em>Smarter</em></p>
            <p className="font-body text-sm text-[#888] mb-4">
              Sign in to earn Royalty Points and track your orders.
            </p>
            <Link href="/app/account" className="btn-primary inline-flex">
              SIGN IN
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
