'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Star, MessageCircle, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';
import { useAuth } from '@/context/AuthContext';

const FEATURES = [
  { icon: ShoppingBag, label: 'Shop', desc: 'Browse all products' },
  { icon: Package, label: 'Track', desc: 'Real-time order updates' },
  { icon: Star, label: 'Earn', desc: 'Royalty Points rewards' },
  { icon: MessageCircle, label: 'Message', desc: 'Chat with our team' },
];

export default function DownloadPage() {
  const router = useRouter();
  const { loginAsDemo } = useAuth();

  function handleTryDemo() {
    loginAsDemo();
    router.push('/app');
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-24">
        {/* Hero */}
        <section className="py-24 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1200]/30 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#C9A84C] opacity-5 blur-[100px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="w-24 h-24 mx-auto mb-8 rounded-2xl overflow-hidden border border-[rgba(201,168,76,0.4)] shadow-gold"
            >
              <Image
                src="/images/photo-1.jpg"
                alt="Brian Chanda Innovations"
                width={96}
                height={96}
                className="w-full h-full object-cover"
                priority
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block font-body text-[10px] font-bold tracking-[0.3em] uppercase text-black bg-[#C9A84C] px-4 py-1.5 mb-6">
                BRIAN CHANDA INNOVATIONS
              </div>
              <h1 className="font-headline text-5xl lg:text-7xl mb-4">
                Get the <em>App</em>
              </h1>
              <p className="font-body text-sm text-[#888] mb-12 leading-relaxed">
                Shop, track, earn rewards — all in one app. The complete Brian Chanda Innovations experience on your phone.
              </p>
            </motion.div>

            {/* Store buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <button className="flex items-center gap-3 bg-white text-black px-8 py-4 font-body text-sm font-semibold hover:bg-gray-100 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.2 1.28-2.18 3.82.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.25 2.65M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </button>
              <button className="flex items-center gap-3 bg-white text-black px-8 py-4 font-body text-sm font-semibold hover:bg-gray-100 transition-colors">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.76c.3.17.65.21.99.1l12.16-7.02-2.73-2.73-10.42 9.65zM.56 1.03C.21 1.39 0 1.96 0 2.67v18.66c0 .71.21 1.28.56 1.64l.09.08 10.45-10.45v-.25L.65.95l-.09.08zM21.34 10.41l-3-1.73-2.85 2.84 2.85 2.85 3.01-1.74c.86-.5.86-1.31-.01-1.22zM3.18.24L15.34 7.26l-2.73 2.73L2.19.34A1.21 1.21 0 013.18.24z"/>
                </svg>
                Google Play
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="flex-1 h-px bg-[rgba(201,168,76,0.2)]" />
              <span className="font-body text-[11px] tracking-[0.3em] uppercase text-[#555]">— OR —</span>
              <div className="flex-1 h-px bg-[rgba(201,168,76,0.2)]" />
            </motion.div>

            {/* Try Demo button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button
                onClick={handleTryDemo}
                className="btn-primary text-base px-10 py-5 inline-flex"
              >
                TRY DEMO IN BROWSER <ChevronRight size={16} />
              </button>
              <p className="font-body text-xs text-[#555] mt-3">
                Demo login: demo@bci.zm · No account required
              </p>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-6 bg-[#0D0D0D]">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="font-headline text-3xl text-center mb-12">
                Everything in <em>One Place</em>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {FEATURES.map(({ icon: Icon, label, desc }, idx) => (
                <ScrollReveal key={label} delay={idx * 100}>
                  <div className="card p-6 text-center group hover:border-[#C9A84C] transition-colors cursor-default">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center group-hover:border-[#C9A84C] transition-colors">
                      <Icon size={20} className="text-[#C9A84C]" />
                    </div>
                    <h3 className="font-headline text-lg mb-1">{label}</h3>
                    <p className="font-body text-xs text-[#888]">{desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
