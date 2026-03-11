'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollReveal from '@/components/ScrollReveal';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', phone: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] pt-24">
        {/* Header */}
        <section className="py-20 px-6 lg:px-12 max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="section-label mb-2">GET IN TOUCH</div>
            <h1 className="font-headline text-5xl lg:text-7xl mb-4">
              Find <em>Us</em>
            </h1>
            <p className="font-body text-sm text-[#888] max-w-md">
              Come visit us at Society Business Park, Lusaka — or reach out online.
            </p>
          </ScrollReveal>
        </section>

        <section className="px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <ScrollReveal direction="left">
              <div className="flex flex-col gap-8">
                <div className="card p-8">
                  <h2 className="font-headline text-2xl mb-6">Store Info</h2>
                  <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0">
                        <MapPin size={16} className="text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">Address</p>
                        <p className="font-body text-sm text-[#888] leading-relaxed">
                          Society Business Park<br />Lusaka, Zambia
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0">
                        <Clock size={16} className="text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">Opening Hours</p>
                        <p className="font-body text-sm text-[#888]">Monday – Saturday: 09:00 – 18:00</p>
                        <p className="font-body text-sm text-[#555]">Sunday: Closed</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0">
                        <Phone size={16} className="text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">Phone</p>
                        <a href="tel:+260977000000" className="font-body text-sm text-[#888] hover:text-[#C9A84C] transition-colors block">
                          +260 977 000 000
                        </a>
                        <a href="tel:+260966000000" className="font-body text-sm text-[#888] hover:text-[#C9A84C] transition-colors block">
                          +260 966 000 000
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0">
                        <Mail size={16} className="text-[#C9A84C]" />
                      </div>
                      <div>
                        <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C] mb-1">Email</p>
                        <a href="mailto:info@bci.zm" className="font-body text-sm text-[#888] hover:text-[#C9A84C] transition-colors">
                          info@bci.zm
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* WhatsApp button */}
                <a
                  href="https://wa.me/260977000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] text-white px-6 py-4 font-body text-sm font-bold tracking-[0.1em] uppercase hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle size={20} />
                  CHAT ON WHATSAPP
                </a>

                {/* Map embed placeholder */}
                <div className="relative h-64 bg-[#111] border border-[rgba(201,168,76,0.2)] flex items-center justify-center overflow-hidden">
                  <div className="text-center">
                    <MapPin size={32} className="text-[#C9A84C] mx-auto mb-3" />
                    <p className="font-body text-sm text-[#888]">Society Business Park</p>
                    <p className="font-body text-xs text-[#555]">Lusaka, Zambia</p>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <a
                      href="https://www.google.com/maps/search/Society+Business+Park+Lusaka"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-[10px] px-4 py-2 inline-flex items-center gap-1"
                    >
                      OPEN MAP <ChevronRight size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="right">
              <div className="card p-8">
                <h2 className="font-headline text-2xl mb-6">Send a Message</h2>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-[#22C55E] flex items-center justify-center">
                      <span className="text-[#22C55E] text-2xl">✓</span>
                    </div>
                    <h3 className="font-headline text-2xl mb-2">Message Sent!</h3>
                    <p className="font-body text-sm text-[#888]">
                      We'll get back to you within a few hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                      <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        placeholder="Your name"
                        required
                        className="input-gold"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="input-gold"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">
                        Phone (optional)
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+260 977 000 000"
                        className="input-gold"
                      />
                    </div>
                    <div>
                      <label className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#555] block mb-2">
                        Message
                      </label>
                      <textarea
                        value={form.message}
                        onChange={e => setForm({ ...form, message: e.target.value })}
                        placeholder="What would you like to know?"
                        required
                        rows={5}
                        className="input-gold resize-none"
                      />
                    </div>
                    <button type="submit" className="btn-primary w-full justify-center mt-2">
                      SEND MESSAGE <ChevronRight size={14} />
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
