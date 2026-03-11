'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Plus, Zap } from 'lucide-react';
import { storageProducts, storageFlashSales } from '@/lib/storage';
import { Product, FlashSale } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

type Cat = 'ALL' | 'FASHION' | 'TECH';

export default function AppShopPage() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<Cat>('ALL');
  const [added, setAdded] = useState<string | null>(null);

  useEffect(() => {
    setProducts(storageProducts.get());
    setFlashSales(storageFlashSales.get().filter(s => s.isActive));
  }, []);

  function handleAdd(e: React.MouseEvent, product: Product) {
    e.preventDefault();
    addItem(product);
    setAdded(product.id);
    setTimeout(() => setAdded(null), 1500);
  }

  const filtered = products.filter(p => {
    const matchCat = cat === 'ALL' || p.category === cat.toLowerCase();
    const matchQ = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()));
    return matchCat && matchQ;
  });

  function getFlashSale(id: string) {
    return flashSales.find(s => s.productId === id);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#0D0D0D] px-4 pt-8 pb-4 border-b border-[rgba(201,168,76,0.15)] sticky top-0 z-30">
        <h1 className="font-headline text-2xl mb-3">Browse <em>Products</em></h1>
        {/* Search */}
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-gold pl-9 text-sm py-3"
          />
        </div>
        {/* Category tabs */}
        <div className="flex gap-2">
          {(['ALL', 'FASHION', 'TECH'] as Cat[]).map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`font-body text-[9px] font-bold tracking-[0.15em] uppercase px-4 py-2 border transition-all ${
                cat === c
                  ? 'bg-[#C9A84C] text-black border-[#C9A84C]'
                  : 'bg-transparent text-[#888] border-[rgba(201,168,76,0.2)]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 py-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-headline text-2xl text-[#333] mb-2">No results</p>
            <p className="font-body text-sm text-[#555]">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(product => {
              const sale = getFlashSale(product.id);
              return (
                <div key={product.id} className="card overflow-hidden group">
                  <Link href={`/app/shop/${product.id}`}>
                    <div className="relative aspect-square bg-[#111]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {sale && (
                        <div className="absolute top-0 left-0 right-0 flex items-center gap-1 bg-[#EF4444] px-2 py-1">
                          <Zap size={10} className="text-white" />
                          <span className="font-body text-[8px] font-bold text-white uppercase tracking-wider">
                            -{sale.percentOff}% FLASH
                          </span>
                        </div>
                      )}
                      {!sale && product.badge && (
                        <span className="absolute top-2 left-2 badge badge-gold text-[7px]">{product.badge}</span>
                      )}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="font-body text-[10px] font-bold text-white tracking-[0.2em] uppercase border border-white px-2 py-1">
                            Pre-Order
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-3">
                    <p className="font-headline text-sm leading-tight mb-1 line-clamp-2">{product.name}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {sale ? (
                        <>
                          <span className="font-headline text-base text-[#EF4444]">{formatPrice(sale.salePrice)}</span>
                          <span className="font-body text-xs text-[#555] line-through">{formatPrice(product.price)}</span>
                        </>
                      ) : (
                        <span className="font-headline text-base text-[#C9A84C]">{formatPrice(product.price)}</span>
                      )}
                    </div>
                    <button
                      onClick={e => handleAdd(e, product)}
                      className={`w-full flex items-center justify-center gap-1 py-2 text-[9px] font-bold tracking-[0.15em] uppercase transition-all duration-200 ${
                        added === product.id ? 'bg-[#22C55E] text-white' : 'btn-primary'
                      }`}
                    >
                      {added === product.id ? '✓ ADDED' : <><Plus size={10} />ADD</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
