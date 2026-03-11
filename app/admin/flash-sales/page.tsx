'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Plus, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageFlashSales, storageProducts } from '@/lib/storage';
import { FlashSale, Product } from '@/lib/types';
import { formatPrice, formatCountdown, percentOff, generateId } from '@/lib/utils';

function Countdown({ endTime }: { endTime: string }) {
  const [secs, setSecs] = useState(Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000)));
  useEffect(() => {
    const interval = setInterval(() => {
      setSecs(s => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return <span className="font-body tabular-nums text-[#EF4444]">{formatCountdown(secs)}</span>;
}

const DURATIONS = [
  { label: '1 Hour', hours: 1 },
  { label: '3 Hours', hours: 3 },
  { label: '6 Hours', hours: 6 },
  { label: '24 Hours', hours: 24 },
];

export default function AdminFlashSalesPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ productId: '', salePrice: '', duration: 3 });

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setSales(storageFlashSales.get());
    setProducts(storageProducts.get());
  }, [isAdminLoggedIn, router]);

  function toggle(id: string) {
    storageFlashSales.toggle(id);
    setSales(storageFlashSales.get());
  }

  function createSale(e: React.FormEvent) {
    e.preventDefault();
    const product = products.find(p => p.id === form.productId);
    if (!product) return;
    const now = new Date();
    const end = new Date(now.getTime() + form.duration * 60 * 60 * 1000);
    const sale: FlashSale = {
      id: generateId(),
      productId: product.id,
      productName: product.name,
      originalPrice: product.price,
      salePrice: Number(form.salePrice),
      percentOff: percentOff(product.price, Number(form.salePrice)),
      startTime: now.toISOString(),
      endTime: end.toISOString(),
      isActive: true,
    };
    storageFlashSales.add(sale);
    setSales(storageFlashSales.get());
    setShowCreate(false);
    setForm({ productId: '', salePrice: '', duration: 3 });
  }

  const activeSales = sales.filter(s => s.isActive);
  const expiredSales = sales.filter(s => !s.isActive || new Date(s.endTime) < new Date());

  const selectedProduct = products.find(p => p.id === form.productId);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-headline text-4xl">Flash <em>Sales</em></h1>
        <button onClick={() => setShowCreate(true)} className="btn-primary">
          <Plus size={14} /> CREATE FLASH SALE
        </button>
      </div>

      {/* Active Sales */}
      <h2 className="font-headline text-2xl mb-4">Active <em>Sales</em></h2>
      {activeSales.length === 0 ? (
        <div className="card p-8 text-center mb-8">
          <Zap size={32} className="text-[#333] mx-auto mb-3" />
          <p className="font-body text-sm text-[#555]">No active flash sales. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {activeSales.map(sale => (
            <div key={sale.id} className="card p-5 border-[rgba(239,68,68,0.3)]">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-[#EF4444]" />
                  <span className="font-body text-[9px] font-bold text-[#EF4444] uppercase tracking-wider">LIVE</span>
                </div>
                <button
                  onClick={() => toggle(sale.id)}
                  className="font-body text-[9px] font-bold uppercase tracking-wider px-2 py-1 border border-[rgba(239,68,68,0.3)] text-[#EF4444] hover:bg-[rgba(239,68,68,0.1)] transition-all"
                >
                  DEACTIVATE
                </button>
              </div>
              <h3 className="font-headline text-lg mb-2">{sale.productName}</h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="font-headline text-2xl text-[#EF4444]">{formatPrice(sale.salePrice)}</span>
                <span className="font-body text-sm text-[#555] line-through">{formatPrice(sale.originalPrice)}</span>
                <span className="badge badge-red text-[8px]">-{sale.percentOff}%</span>
              </div>
              <div>
                <p className="font-body text-[9px] text-[#555] uppercase tracking-wider mb-1">Time Remaining</p>
                <Countdown endTime={sale.endTime} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Archived */}
      {expiredSales.length > 0 && (
        <>
          <h2 className="font-headline text-2xl mb-4">Archived <em>Sales</em></h2>
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.05)]">
                  {['Product', 'Original', 'Sale Price', '% Off', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-body text-[10px] uppercase tracking-wider text-[#555]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expiredSales.map(sale => (
                  <tr key={sale.id} className="border-b border-[rgba(255,255,255,0.04)]">
                    <td className="px-4 py-3 font-body text-sm text-[#888]">{sale.productName}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#555] line-through">{formatPrice(sale.originalPrice)}</td>
                    <td className="px-4 py-3 font-headline text-sm">{formatPrice(sale.salePrice)}</td>
                    <td className="px-4 py-3 font-body text-sm text-[#888]">{sale.percentOff}%</td>
                    <td className="px-4 py-3">
                      <span className="font-body text-[9px] text-[#555] uppercase tracking-wider border border-[rgba(255,255,255,0.05)] px-2 py-0.5">
                        ENDED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
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
                <h2 className="font-headline text-2xl">Create <em>Flash Sale</em></h2>
                <button onClick={() => setShowCreate(false)}><X size={20} className="text-[#555]" /></button>
              </div>
              <form onSubmit={createSale} className="space-y-4">
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Select Product</label>
                  <select required value={form.productId} onChange={e => setForm({...form, productId: e.target.value})} className="input-gold">
                    <option value="">— Choose product —</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({formatPrice(p.price)})</option>
                    ))}
                  </select>
                </div>
                {selectedProduct && (
                  <p className="font-body text-xs text-[#888]">Original price: <span className="text-[#C9A84C]">{formatPrice(selectedProduct.price)}</span></p>
                )}
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Sale Price (K)</label>
                  <input
                    required type="number"
                    placeholder="Sale price"
                    value={form.salePrice}
                    onChange={e => setForm({...form, salePrice: e.target.value})}
                    max={selectedProduct?.price}
                    className="input-gold"
                  />
                  {selectedProduct && form.salePrice && (
                    <p className="font-body text-xs text-[#EF4444] mt-1">
                      {percentOff(selectedProduct.price, Number(form.salePrice))}% discount
                    </p>
                  )}
                </div>
                <div>
                  <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">Duration</label>
                  <div className="grid grid-cols-2 gap-2">
                    {DURATIONS.map(d => (
                      <button
                        key={d.hours}
                        type="button"
                        onClick={() => setForm({...form, duration: d.hours})}
                        className={`py-2.5 font-body text-[10px] font-bold tracking-wider uppercase border transition-all ${
                          form.duration === d.hours ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[rgba(255,255,255,0.08)] text-[#555]'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full justify-center py-4">
                  <Zap size={14} /> GO LIVE →
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
