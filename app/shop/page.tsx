'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import ScrollReveal from '@/components/ScrollReveal';
import StickyCartButton from '@/components/StickyCartButton';
import { storageProducts } from '@/lib/storage';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

type Filter = 'ALL' | 'FASHION' | 'TECH' | 'NEW' | 'SALE';

const FILTERS: { label: string; value: Filter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Fashion', value: 'FASHION' },
  { label: 'Tech', value: 'TECH' },
  { label: 'New Arrivals', value: 'NEW' },
  { label: 'Sale', value: 'SALE' },
];

export default function ShopPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<Filter>('ALL');
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    setProducts(storageProducts.get());
  }, []);

  function handleAdd(product: Product) {
    addItem(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  }

  const filtered = products.filter(p => {
    if (filter === 'ALL') return true;
    if (filter === 'FASHION') return p.category === 'fashion';
    if (filter === 'TECH') return p.category === 'tech';
    if (filter === 'NEW') return p.badge.toLowerCase().includes('new');
    if (filter === 'SALE') return !!p.flashSalePrice;
    return true;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-24">
        {/* Header */}
        <section className="px-6 lg:px-12 py-16 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="section-label mb-2">SHOP</div>
            <h1 className="font-headline text-5xl lg:text-7xl mb-4">
              All <em>Products</em>
            </h1>
            <p className="font-body text-sm text-[#888]">
              Premium fashion and tech. {products.length} items available.
            </p>
          </ScrollReveal>
        </section>

        <Ticker />

        {/* Filters */}
        <div className="px-6 lg:px-12 py-8 max-w-7xl mx-auto">
          <div className="flex gap-3 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`font-body text-[10px] font-bold tracking-[0.2em] uppercase px-6 py-3 border transition-all duration-200 ${
                  filter === f.value
                    ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                    : 'bg-transparent text-[#888] border-[rgba(201,168,76,0.2)] hover:border-[#C9A84C] hover:text-[#C9A84C]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <section className="px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={filter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {filtered.map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 40}>
                  <div className="group card overflow-hidden">
                    <Link href={`/app/shop/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#111]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {product.badge && (
                        <span className="absolute top-2 left-2 badge badge-gold text-[8px]">{product.badge}</span>
                      )}
                      {product.flashSalePrice && (
                        <span className="absolute top-2 right-2 badge badge-red text-[8px]">SALE</span>
                      )}
                    </Link>
                    <div className="p-3">
                      <span className="font-body text-[9px] tracking-[0.15em] uppercase text-[#555]">
                        {product.category}
                      </span>
                      <h3 className="font-headline text-base leading-tight mt-1 mb-1">{product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        {product.flashSalePrice ? (
                          <>
                            <span className="font-headline text-lg text-[#EF4444]">{formatPrice(product.flashSalePrice)}</span>
                            <span className="font-body text-xs text-[#555] line-through">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          <span className="font-headline text-lg text-[#C9A84C]">{formatPrice(product.price)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAdd(product)}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                          added === product.id
                            ? 'bg-[#22C55E] text-white'
                            : 'btn-primary'
                        }`}
                      >
                        {added === product.id ? '✓ ADDED' : <><Plus size={12} /> ADD</>}
                      </button>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-24">
              <p className="font-headline text-3xl text-[#333] mb-4">No products found</p>
              <button onClick={() => setFilter('ALL')} className="btn-outline">
                VIEW ALL
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <StickyCartButton />
    </>
  );
}
