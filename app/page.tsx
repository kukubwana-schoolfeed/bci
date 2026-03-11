'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy, ChevronRight, MapPin, Clock, Phone, Package, MessageCircle, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Ticker from '@/components/Ticker';
import ScrollReveal from '@/components/ScrollReveal';
import StickyCartButton from '@/components/StickyCartButton';
import { storageProducts } from '@/lib/storage';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export default function HomePage() {
  const { addItem } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [heroY, setHeroY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const products = storageProducts.get();
    const fashion = products.filter(p => p.category === 'fashion').slice(0, 1);
    const tech = products.filter(p => p.category === 'tech').slice(0, 2);
    setFeaturedProducts([...fashion, ...tech]);
  }, []);

  useEffect(() => {
    const onScroll = () => setHeroY(window.scrollY * 0.4);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A]">
        {/* ====== HERO ====== */}
        <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
          <div
            className="absolute will-change-transform"
            style={{ transform: `translateY(${heroY}px)`, top: '-10%', left: 0, right: 0, bottom: '-10%' }}
          >
            <Image
              src="/images/photo-4.jpg"
              alt="Brian Chanda Innovations"
              fill
              className="object-cover object-center"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-black/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0A0A0A]" />

          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="font-body text-[11px] font-bold tracking-[0.4em] uppercase text-[#C9A84C] mb-6"
            >
              — FASHION · TECH · INNOVATION
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-headline text-6xl sm:text-7xl lg:text-9xl font-light leading-[0.9] mb-8"
            >
              Redefining<br />
              Zambian<br />
              <em className="text-[#C9A84C]">Style</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="font-body text-sm text-[#888] max-w-md mb-10 leading-relaxed"
            >
              Premium fashion and technology. One destination.<br />
              Society Business Park, Lusaka.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/shop" className="btn-primary">
                SHOP NOW <ChevronRight size={14} />
              </Link>
              <Link href="/download" className="btn-outline">
                DOWNLOAD APP
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-[#555]">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-[#C9A84C] to-transparent" />
          </motion.div>
        </section>

        {/* ====== TICKER ====== */}
        <Ticker />

        {/* ====== AWARDS ====== */}
        <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="section-label justify-center mb-2">RECOGNITION</div>
            <h2 className="font-headline text-4xl lg:text-5xl text-center mb-16">
              Award <em>Winning</em>
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Best Fashion Retailer', year: '2023', desc: 'Recognised for excellence in fashion retail across Lusaka.' },
              { title: 'Tech Innovation Award', year: '2024', desc: 'Awarded for bringing premium tech products to Zambia.' },
              { title: 'Young Entrepreneur Award', year: '2024', desc: 'Honoured for outstanding business growth and community impact.' },
            ].map((award, idx) => (
              <ScrollReveal key={idx} delay={idx * 150}>
                <div className="card p-8 text-center group cursor-default">
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center group-hover:border-[#C9A84C] transition-colors">
                    <Trophy size={24} className="text-[#C9A84C]" />
                  </div>
                  <p className="font-body text-[10px] font-bold tracking-[0.25em] uppercase text-[#C9A84C] mb-2">{award.year}</p>
                  <h3 className="font-headline text-xl mb-3">{award.title}</h3>
                  <p className="font-body text-sm text-[#888] leading-relaxed">{award.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ====== FEATURED PRODUCTS ====== */}
        <section className="py-24 px-6 lg:px-12 bg-[#0D0D0D]">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex items-end justify-between mb-16">
                <div>
                  <div className="section-label mb-2">LATEST DROPS</div>
                  <h2 className="font-headline text-4xl lg:text-5xl">New <em>Arrivals</em></h2>
                </div>
                <Link href="/shop" className="hidden md:flex items-center gap-2 font-body text-[11px] font-bold tracking-[0.15em] uppercase text-[#C9A84C] hover:text-[#E2C675] transition-colors">
                  VIEW ALL <ChevronRight size={14} />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((product, idx) => (
                <ScrollReveal key={product.id} delay={idx * 100}>
                  <div className="group relative card overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-[#111]">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 badge badge-gold">{product.badge}</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="font-body text-[9px] tracking-[0.15em] uppercase text-[#555] border border-[rgba(255,255,255,0.08)] px-2 py-0.5">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-headline text-lg mb-1">{product.name}</h3>
                      <p className="font-headline text-2xl text-[#C9A84C] mb-4">{formatPrice(product.price)}</p>
                      <div className="flex gap-3">
                        <button onClick={() => addItem(product)} className="btn-primary flex-1 text-[10px] py-3 justify-center">
                          ADD TO CART
                        </button>
                        <Link href={`/app/shop/${product.id}`} className="btn-outline px-4 py-3 text-[10px]">
                          VIEW
                        </Link>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ====== APP DOWNLOAD TEASER ====== */}
        <section className="py-24 px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#1a1200] to-[#0A0A0A]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#C9A84C] blur-[120px]" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <ScrollReveal direction="left" className="flex justify-center">
                <div className="phone-mockup">
                  <div className="absolute inset-2 rounded-[30px] overflow-hidden bg-[#0A0A0A] flex flex-col">
                    <div className="bg-[#111] px-4 pt-8 pb-4 border-b border-[rgba(201,168,76,0.15)]">
                      <p className="font-body text-[8px] font-bold tracking-[0.2em] uppercase text-[#C9A84C]">BRIAN CHANDA</p>
                      <p className="font-headline text-base">Shop <em>Smarter</em></p>
                    </div>
                    <div className="flex-1 p-3">
                      <div className="bg-[#C9A84C]/10 border border-[rgba(201,168,76,0.2)] p-3 mb-2 rounded">
                        <p className="font-body text-[8px] text-[#C9A84C] font-bold tracking-wider uppercase">FLASH SALE</p>
                        <p className="font-body text-[7px] text-[#888]">30% off JBL Speaker · 4h left</p>
                      </div>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-2 mb-2">
                          <div className="w-12 h-12 bg-[#1C1C1C] border border-[rgba(201,168,76,0.1)] flex-shrink-0" />
                          <div className="flex-1 pt-1">
                            <div className="h-2 bg-[#1C1C1C] rounded mb-1 w-3/4" />
                            <div className="h-2 bg-[#C9A84C]/30 rounded w-1/3" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#111] border-t border-[rgba(201,168,76,0.15)] px-3 py-2 flex justify-around">
                      {['H', 'S', '★'].map((icon, i) => (
                        <div key={i} className={`flex flex-col items-center gap-0.5 ${i === 0 ? 'text-[#C9A84C]' : 'text-[#333]'}`}>
                          <span className="text-xs font-bold">{icon}</span>
                          <div className="h-0.5 w-3 bg-current rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction="right">
                <div className="section-label mb-2">GET THE APP</div>
                <h2 className="font-headline text-4xl lg:text-6xl mb-6">Download the <em>App</em></h2>
                <p className="font-body text-sm text-[#888] mb-8 leading-relaxed">
                  Browse, order and track — all from your phone. The BCI app gives you the full experience.
                </p>
                <div className="flex flex-col gap-3 mb-10">
                  {[
                    { icon: Star, text: 'Loyalty points on every purchase' },
                    { icon: Package, text: 'Real-time order tracking' },
                    { icon: Star, text: 'Exclusive drops and flash sales' },
                    { icon: MessageCircle, text: 'Direct messaging with our team' },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-[rgba(201,168,76,0.4)] flex items-center justify-center flex-shrink-0">
                        <Icon size={12} className="text-[#C9A84C]" />
                      </div>
                      <span className="font-body text-sm text-[#F5F0E8]">{text}</span>
                    </div>
                  ))}
                </div>
                <Link href="/download" className="btn-primary inline-flex">
                  GET THE APP <ChevronRight size={14} />
                </Link>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ====== LOCATION ====== */}
        <section className="py-24 px-6 lg:px-12 bg-[#0D0D0D]">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <div className="section-label justify-center mb-2">FIND US</div>
              <h2 className="font-headline text-4xl lg:text-5xl mb-12">Visit <em>Us</em></h2>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <div className="card p-8 lg:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: MapPin, label: 'Location', info: 'Society Business Park\nLusaka, Zambia' },
                  { icon: Clock, label: 'Hours', info: 'Mon – Sat: 09:00 – 18:00\nSunday: Closed' },
                  { icon: Phone, label: 'Phone', info: '+260 977 000 000\n+260 966 000 000' },
                ].map(({ icon: Icon, label, info }) => (
                  <div key={label} className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center">
                      <Icon size={20} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <p className="font-body text-[11px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">{label}</p>
                      {info.split('\n').map((line, i) => (
                        <p key={i} className="font-body text-sm text-[#888]">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200} className="mt-8">
              <Link href="/contact" className="btn-outline inline-flex">
                GET DIRECTIONS <ChevronRight size={14} />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
      <StickyCartButton />
    </>
  );
}
