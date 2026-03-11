'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Package, Star, MessageCircle, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const NAV_ITEMS = [
  { href: '/app', label: 'Home', icon: Home },
  { href: '/app/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/app/orders', label: 'Orders', icon: Package },
  { href: '/app/loyalty', label: 'Loyalty', icon: Star },
  { href: '/app/messages', label: 'Messages', icon: MessageCircle },
  { href: '/app/account', label: 'Account', icon: User },
];

export default function AppNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-[rgba(201,168,76,0.2)] px-2 pb-safe">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === '/app' ? pathname === '/app' : pathname.startsWith(href);
          const isShop = href === '/app/shop';
          const isCart = href === '/app/cart';

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 py-3 px-3 min-w-[48px] transition-all duration-200 ${
                isActive ? 'text-[#C9A84C]' : 'text-[#555] hover:text-[#888]'
              }`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
                {isShop && totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C9A84C] text-black text-[8px] font-bold flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
              <span className="font-body text-[9px] font-semibold tracking-[0.1em] uppercase leading-none">
                {label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-[#C9A84C] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
