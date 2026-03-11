'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, MessageSquare, Package, BoxSelect,
  Users, BarChart2, Radio, Zap, UserCog, LogOut,
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inbox', label: 'Inbox', icon: MessageSquare },
  { href: '/admin/orders', label: 'Orders', icon: Package },
  { href: '/admin/inventory', label: 'Inventory', icon: BoxSelect },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/broadcast', label: 'Broadcast', icon: Radio },
  { href: '/admin/flash-sales', label: 'Flash Sales', icon: Zap },
  { href: '/admin/staff', label: 'Staff', icon: UserCog },
];

export default function AdminNav() {
  const pathname = usePathname();
  const { adminUser, adminLogout } = useAdmin();
  const router = useRouter();

  function handleLogout() {
    adminLogout();
    router.push('/admin');
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-[#0D0D0D] border-r border-[rgba(201,168,76,0.15)] flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-[rgba(201,168,76,0.15)]">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[rgba(201,168,76,0.4)]">
            <Image src="/images/photo-1.jpg" alt="BCI" fill className="object-cover" />
          </div>
          <div>
            <p className="font-body text-[9px] font-bold tracking-[0.25em] uppercase text-[#C9A84C] leading-none">
              BRIAN CHANDA
            </p>
            <p className="font-body text-[8px] tracking-[0.2em] uppercase text-[#555] leading-none mt-0.5">
              ADMIN
            </p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 ${
                  isActive
                    ? 'bg-[rgba(201,168,76,0.12)] text-[#C9A84C]'
                    : 'text-[#555] hover:text-[#888] hover:bg-[#161616]'
                }`}
              >
                <Icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                <span className="font-body text-[11px] font-semibold tracking-[0.1em] uppercase">
                  {label}
                </span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[rgba(201,168,76,0.15)]">
        {adminUser && (
          <div className="px-3 mb-3">
            <p className="font-body text-xs font-semibold text-[#F5F0E8] truncate">{adminUser.name}</p>
            <p className="font-body text-[10px] text-[#555] capitalize">{adminUser.role}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-[#555] hover:text-[#EF4444] hover:bg-[#161616] rounded transition-all duration-200"
        >
          <LogOut size={16} />
          <span className="font-body text-[11px] font-semibold tracking-[0.1em] uppercase">
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}
