'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { storageOrders } from '@/lib/storage';
import { Order } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/utils';
import Link from 'next/link';

const STATUS_STEPS = ['received', 'processing', 'dispatched', 'delivered'] as const;
const STATUS_LABELS: Record<string, string> = {
  received: 'Order Received',
  processing: 'Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
};
const STATUS_COLORS: Record<string, string> = {
  received: '#888',
  processing: '#F59E0B',
  dispatched: '#3B82F6',
  delivered: '#22C55E',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const all = storageOrders.get();
    setOrders(user ? all.filter(o => o.userId === user.id) : all.slice(0, 5));
  }, [user]);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6 text-center">
        <Package size={48} className="text-[#333] mb-6" />
        <h1 className="font-headline text-3xl mb-3">No orders <em>yet</em></h1>
        <p className="font-body text-sm text-[#888] mb-8">Your orders will appear here once you shop.</p>
        <Link href="/app/shop" className="btn-primary">BROWSE PRODUCTS</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="px-4 pt-8 pb-4 border-b border-[rgba(201,168,76,0.15)]">
        <h1 className="font-headline text-3xl">My <em>Orders</em></h1>
        <p className="font-body text-xs text-[#888] mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {orders.map(order => {
          const isExpanded = expanded === order.id;
          const statusIdx = STATUS_STEPS.indexOf(order.status as any);

          return (
            <div key={order.id} className="card overflow-hidden">
              {/* Order header */}
              <button
                onClick={() => setExpanded(isExpanded ? null : order.id)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0"
                    style={{ borderColor: STATUS_COLORS[order.status] }}>
                    <Package size={16} style={{ color: STATUS_COLORS[order.status] }} />
                  </div>
                  <div>
                    <p className="font-body text-xs font-bold text-[#C9A84C] tracking-wider">{order.ref}</p>
                    <p className="font-body text-xs text-[#555]">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-headline text-lg">{formatPrice(order.total)}</p>
                    <span className="font-body text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: STATUS_COLORS[order.status] }}>
                      {order.status}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-[#555]" /> : <ChevronDown size={16} className="text-[#555]" />}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 pb-4 border-t border-[rgba(201,168,76,0.1)]">
                      {/* Progress bar */}
                      <div className="py-5">
                        <div className="flex items-center justify-between mb-2">
                          {STATUS_STEPS.map((step, i) => (
                            <div key={step} className="flex flex-col items-center flex-1">
                              <div
                                className="w-3 h-3 rounded-full border-2 mb-1 transition-all"
                                style={{
                                  borderColor: i <= statusIdx ? STATUS_COLORS[order.status] : '#333',
                                  background: i <= statusIdx ? STATUS_COLORS[order.status] : 'transparent',
                                  boxShadow: i === statusIdx ? `0 0 10px ${STATUS_COLORS[order.status]}` : 'none',
                                }}
                              />
                              {i < STATUS_STEPS.length - 1 && (
                                <div className="hidden" /> // spacer
                              )}
                            </div>
                          ))}
                        </div>
                        {/* Connection line */}
                        <div className="relative h-1 bg-[#1C1C1C] -mt-3 mx-6">
                          <div
                            className="absolute top-0 left-0 h-full transition-all duration-500"
                            style={{
                              width: `${(statusIdx / (STATUS_STEPS.length - 1)) * 100}%`,
                              background: STATUS_COLORS[order.status],
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-2">
                          {STATUS_STEPS.map((step, i) => (
                            <span
                              key={step}
                              className="font-body text-[8px] text-center tracking-wider uppercase flex-1"
                              style={{ color: i <= statusIdx ? STATUS_COLORS[order.status] : '#333' }}
                            >
                              {STATUS_LABELS[step].split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between font-body text-sm">
                            <span className="text-[#888]">{item.name} × {item.quantity}</span>
                            <span>{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                        <div className="h-px bg-[rgba(201,168,76,0.1)] my-2" />
                        <div className="flex justify-between font-body text-sm">
                          <span className="text-[#555]">Delivery</span>
                          <span className="text-[#555]">{order.deliveryFee === 0 ? 'FREE' : formatPrice(order.deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-body text-sm font-semibold">Total</span>
                          <span className="font-headline text-xl text-[#C9A84C]">{formatPrice(order.total)}</span>
                        </div>
                      </div>

                      {/* Delivery address */}
                      <p className="font-body text-xs text-[#555]">
                        Delivering to: <span className="text-[#888]">{order.deliveryAddress}</span>
                      </p>

                      {/* Loyalty points */}
                      {order.loyaltyPointsEarned > 0 && (
                        <p className="font-body text-xs text-[#C9A84C] mt-2">
                          +{order.loyaltyPointsEarned} Royalty Points earned
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
