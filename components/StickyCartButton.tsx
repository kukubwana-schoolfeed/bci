'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function StickyCartButton() {
  const { totalItems, subtotal } = useCart();
  const pathname = usePathname();

  // Only show on website pages (not in /app or /admin)
  if (pathname.startsWith('/app') || pathname.startsWith('/admin')) return null;
  if (totalItems === 0) return null;

  return (
    <Link
      href="/app/cart"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#C9A84C] text-black px-5 py-3.5 rounded-none shadow-lg hover:bg-[#E2C675] transition-all duration-300 hover:shadow-gold group"
      style={{ boxShadow: '0 0 30px rgba(201,168,76,0.4)' }}
    >
      <ShoppingBag size={18} />
      <div>
        <p className="font-body text-[10px] font-bold tracking-[0.15em] uppercase leading-none">
          View Cart ({totalItems})
        </p>
        <p className="font-headline text-sm font-semibold leading-none mt-0.5">
          {formatPrice(subtotal)}
        </p>
      </div>
    </Link>
  );
}
