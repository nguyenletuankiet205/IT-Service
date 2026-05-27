'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AdminAuthGuard from '../../components/AdminAuthGuard';
import AdminSidebar from '../../components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <AdminAuthGuard>{children}</AdminAuthGuard>;
  }

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
        <AdminSidebar />
        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-x-hidden">{children}</main>
      </div>
    </AdminAuthGuard>
  );
}
