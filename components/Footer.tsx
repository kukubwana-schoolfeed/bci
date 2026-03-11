import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[rgba(201,168,76,0.15)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[rgba(201,168,76,0.3)]">
                <Image
                  src="/images/photo-1.jpg"
                  alt="Brian Chanda Innovations"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-body text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A84C]">
                  BRIAN CHANDA
                </p>
                <p className="font-body text-[10px] tracking-[0.2em] uppercase text-[#888]">
                  INNOVATIONS
                </p>
              </div>
            </div>
            <p className="font-body text-sm text-[#888] leading-relaxed max-w-xs mb-6">
              Premium fashion and technology. One destination. Society Business Park, Lusaka, Zambia.
            </p>
            <p className="font-headline italic text-2xl text-[#C9A84C]">
              Fashion. Tech. Innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-body text-[11px] font-bold tracking-[0.25em] uppercase text-[#C9A84C] mb-6">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop' },
                { href: '/download', label: 'Download App' },
                { href: '/contact', label: 'Contact' },
                { href: '/app', label: 'Customer App' },
                { href: '/admin', label: 'Staff Login' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-[#888] hover:text-[#C9A84C] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-body text-[11px] font-bold tracking-[0.25em] uppercase text-[#C9A84C] mb-6">
              Contact
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#C9A84C] mt-0.5 flex-shrink-0" />
                <span className="font-body text-sm text-[#888] leading-relaxed">
                  Society Business Park<br />Lusaka, Zambia
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-[#C9A84C] flex-shrink-0" />
                <a href="tel:+260977000000" className="font-body text-sm text-[#888] hover:text-[#C9A84C] transition-colors">
                  +260 977 000 000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-[#C9A84C] flex-shrink-0" />
                <a href="mailto:info@bci.zm" className="font-body text-sm text-[#888] hover:text-[#C9A84C] transition-colors">
                  info@bci.zm
                </a>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <a href="#" className="text-[#888] hover:text-[#C9A84C] transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="text-[#888] hover:text-[#C9A84C] transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[rgba(201,168,76,0.1)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-[#555] tracking-wide">
            © {new Date().getFullYear()} Brian Chanda Innovations. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="font-body text-xs text-[#555]">Made in</span>
            <span className="font-body text-xs text-[#C9A84C] font-semibold">Lusaka, Zambia 🏆</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
