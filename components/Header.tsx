'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShieldAlert, Monitor, ChevronRight } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle transparent to blurred background transition on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Dịch vụ IT', href: '/services' },
    { name: 'Bảng giá', href: '/pricing' },
    { name: 'Đặt lịch ngay', href: '/booking' },
    { name: 'Liên hệ', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Close mobile menu when route changes (defer to avoid sync setState in effect)
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors shadow-md shadow-blue-200">
              <Monitor className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl text-gray-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                TechCare
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold leading-none">
                IT Services
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          {!isAdminRoute ? (
            <nav className="hidden md:flex space-x-8 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors duration-200 relative py-2 ${
                    isActive(link.href)
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                  {isActive(link.href) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
                  )}
                </Link>
              ))}
              
              <Link
                href="/admin"
                className="flex items-center space-x-1.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 px-3.5 py-1.5 rounded-full border border-gray-200 hover:border-blue-100 transition-all text-xs font-semibold"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-gray-400 group-hover:text-blue-500" />
                <span>Quản trị</span>
              </Link>
            </nav>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Hệ thống Quản trị
              </span>
              <Link
                href="/"
                className="flex items-center space-x-1 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full"
              >
                <span>Xem Website</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-md focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 absolute top-16 left-0 w-full shadow-lg z-40 transition-transform duration-300">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {!isAdminRoute ? (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`block px-4 py-3 rounded-lg text-base font-semibold ${
                      isActive(link.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 my-2 pt-2">
                  <Link
                    href="/admin"
                    className="flex items-center space-x-2 px-4 py-3 text-base font-semibold text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-lg"
                  >
                    <ShieldAlert className="h-4 w-4 text-gray-400" />
                    <span>Hệ thống Quản trị</span>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Hệ thống Quản trị
                </div>
                <Link
                  href="/"
                  className="block px-4 py-3 text-base font-semibold text-blue-600 bg-blue-50 rounded-lg"
                >
                  Quay lại Website chính
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
