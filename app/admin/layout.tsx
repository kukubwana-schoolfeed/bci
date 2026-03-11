'use client';

import { useAdmin } from '@/context/AdminContext';
import { usePathname } from 'next/navigation';
import AdminNav from '@/components/AdminNav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useAdmin();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  if (isLoginPage || !isAdminLoggedIn) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      <AdminNav />
      <main className="flex-1 ml-60 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
