'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  
  LogOut, 
  ArrowLeft,
  Monitor,
  UserCheck
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { name: 'Lịch đặt hẹn', href: '/admin/appointments', icon: Calendar },
    { name: 'Khách hàng & Lead', href: '/admin/customers', icon: UserCheck },
    { name: 'Quản lý Dịch vụ', href: '/admin/services', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    sessionStorage.removeItem('techcare_admin_logged_in');
    router.push('/admin/login');
    router.refresh();
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-slate-400 flex flex-col md:min-h-screen border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-950">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <Monitor className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-sm sm:text-base text-white tracking-tight leading-none">
            TechCare Admin
          </span>
          <span className="text-[9px] text-blue-400 font-bold uppercase tracking-widest mt-1">
            Hệ thống Quản trị
          </span>
        </div>
      </div>

      {/* Admin User Info Tag */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center space-x-3 text-xs">
        <div className="p-1.5 bg-slate-800 text-emerald-400 rounded-full border border-slate-700">
          <UserCheck className="h-3.5 w-3.5" />
        </div>
        <div className="flex flex-col truncate">
          <span className="font-bold text-slate-200">Quản trị viên</span>
          <span className="text-[10px] text-slate-500 font-semibold truncate">admin@techcare.vn</span>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-grow p-4 space-y-1.5">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                  : 'hover:bg-slate-800/60 hover:text-slate-200 text-slate-400'
              }`}
            >
              <IconComponent className="h-4.5 w-4.5 flex-shrink-0" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
        <Link
          href="/"
          className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Quay lại Website</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 transition-all border border-transparent hover:border-red-900/30 text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </aside>
  );
}
