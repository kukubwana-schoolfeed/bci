'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/download', label: 'App' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[rgba(201,168,76,0.15)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[rgba(201,168,76,0.3)] group-hover:border-[#C9A84C] transition-colors">
              <Image
                src="/images/photo-1.jpg"
                alt="Brian Chanda Innovations"
                fill
                className="object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <p className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#C9A84C] leading-none">
                BRIAN CHANDA
              </p>
              <p className="font-body text-[9px] font-normal tracking-[0.2em] uppercase text-[#888] leading-none mt-0.5">
                INNOVATIONS
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/download"
              className="hidden md:inline-flex btn-primary text-[10px] px-6 py-3"
            >
              DOWNLOAD APP
            </Link>

            <Link href="/app/cart" className="relative p-2 text-[#888] hover:text-[#C9A84C] transition-colors">
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C9A84C] text-black text-[9px] font-bold flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-[#888] hover:text-[#C9A84C] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-t border-[rgba(201,168,76,0.15)]">
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link text-base"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/download"
              className="btn-primary text-center mt-2"
              onClick={() => setMenuOpen(false)}
            >
              DOWNLOAD APP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
