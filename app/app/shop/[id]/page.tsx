'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronLeft, ShoppingBag, Minus, Plus, Star } from 'lucide-react';
import { storageProducts } from '@/lib/storage';
import { Product } from '@/lib/types';
import { formatPrice, calculateLoyaltyPoints } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addItem } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const all = storageProducts.get();
    const found = all.find(p => p.id === id) ?? null;
    setProduct(found);
    if (found) {
      setRelated(all.filter(p => p.category === found.category && p.id !== found.id).slice(0, 4));
    }
  }, [id]);

  function handleAdd() {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (!product) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <p className="font-headline text-2xl text-[#333]">Product not found</p>
    </div>
  );

  const pointsToEarn = calculateLoyaltyPoints(product.price * quantity, user?.loyaltyTier ?? 'Bronze');

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Back */}
      <div className="px-4 pt-6 pb-2">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#888] hover:text-[#C9A84C] transition-colors">
          <ChevronLeft size={18} />
          <span className="font-body text-xs font-semibold tracking-[0.15em] uppercase">Back</span>
        </button>
      </div>

      {/* Image */}
      <div className="relative w-full aspect-square bg-[#111]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        {product.badge && (
          <span className="absolute top-4 left-4 badge badge-gold">{product.badge}</span>
        )}
      </div>

      <div className="px-4 py-6">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {product.tags.map(tag => (
            <span key={tag} className="font-body text-[9px] tracking-[0.15em] uppercase text-[#555] border border-[rgba(255,255,255,0.08)] px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>

        {/* Name & Price */}
        <h1 className="font-headline text-3xl mb-2">{product.name}</h1>
        <p className="font-headline text-4xl text-[#C9A84C] mb-4">{formatPrice(product.price)}</p>

        {/* Description */}
        <p className="font-body text-sm text-[#888] leading-relaxed mb-6">{product.description}</p>

        {/* Loyalty Points Notice */}
        <div className="flex items-center gap-3 bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] p-3 mb-6">
          <Star size={16} className="text-[#C9A84C] flex-shrink-0" fill="currentColor" />
          <p className="font-body text-xs text-[#C9A84C]">
            Earn <strong>{pointsToEarn} Royalty Points</strong> on this purchase
          </p>
        </div>

        {/* Quantity */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555]">Quantity</span>
          <div className="flex items-center border border-[rgba(201,168,76,0.3)]">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-[#C9A84C] transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center font-headline text-xl">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
              className="w-10 h-10 flex items-center justify-center text-[#888] hover:text-[#C9A84C] transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <span className="font-body text-xs text-[#555]">{product.stock} in stock</span>
        </div>

        {/* CTA */}
        {product.inStock ? (
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center justify-center gap-2 py-5 font-body text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 ${
              added
                ? 'bg-[#22C55E] text-white'
                : 'bg-[#C9A84C] text-black hover:bg-[#E2C675]'
            }`}
            style={{ boxShadow: added ? '0 0 30px rgba(34,197,94,0.4)' : '0 0 30px rgba(201,168,76,0.3)' }}
          >
            {added ? (
              <>✓ ADDED TO CART</>
            ) : (
              <><ShoppingBag size={16} /> ADD TO CART — {formatPrice(product.price * quantity)}</>
            )}
          </motion.button>
        ) : (
          <button className="w-full btn-outline py-5 text-[11px] justify-center">
            PRE-ORDER
          </button>
        )}

        <Link href="/app/cart" className="block text-center font-body text-xs text-[#555] hover:text-[#C9A84C] transition-colors mt-4">
          View Cart
        </Link>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="px-4 py-6 border-t border-[rgba(201,168,76,0.1)]">
          <h2 className="font-headline text-xl mb-4">You may also <em>like</em></h2>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {related.map(p => (
              <Link key={p.id} href={`/app/shop/${p.id}`} className="flex-shrink-0 w-36">
                <div className="relative h-32 bg-[#111] mb-2">
                  <Image src={p.image} alt={p.name} fill className="object-cover" />
                </div>
                <p className="font-headline text-sm leading-tight">{p.name}</p>
                <p className="font-headline text-sm text-[#C9A84C]">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
