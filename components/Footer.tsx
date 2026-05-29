'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock, Monitor, ChevronRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const servicesLinks = [
    { name: 'Cài đặt Windows & Office', href: '/services' },
    { name: 'Sửa lỗi phần cứng & mạng', href: '/services' },
    { name: 'Lắp đặt camera trọn gói', href: '/services' },
    { name: 'Thiết kế website Landing Page', href: '/services' },
    { name: 'Cấu hình VPS, Domain, Cloudflare', href: '/services' },
  ];

  const policyLinks = [
    { name: 'Trang chủ', href: '/' },
    { name: 'Dịch vụ & Báo giá', href: '/services' },
    { name: 'Bảng giá chi tiết', href: '/pricing' },
    { name: 'Đặt lịch kỹ thuật viên', href: '/booking' },
    { name: 'Liên hệ & Tư vấn', href: '/contact' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      {/* Upper Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Brand Info */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-white tracking-tight leading-tight">
                  TechCare
                </span>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-semibold leading-none">
                  IT Services
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed pt-2">
              Giải pháp hỗ trợ kỹ thuật IT tận nơi uy tín và chuyên nghiệp tại TP. Hồ Chí Minh. Đồng hành cùng cá nhân, hộ gia đình và doanh nghiệp nhỏ.
            </p>
            <div className="flex items-center space-x-2 text-sm text-white font-semibold pt-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Giờ mở cửa: 08:00 - 20:00 hàng ngày</span>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-3">
              Dịch vụ hàng đầu
            </h3>
            <ul className="space-y-2.5 text-sm">
              {servicesLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors flex items-center group text-gray-400"
                  >
                    <ChevronRight className="h-3.5 w-3.5 mr-1 text-gray-600 group-hover:text-blue-500 transition-colors" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Site Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-3">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2.5 text-sm">
              {policyLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-white transition-colors flex items-center group text-gray-400"
                  >
                    <ChevronRight className="h-3.5 w-3.5 mr-1 text-gray-600 group-hover:text-blue-500 transition-colors" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-blue-500 pl-3">
              Thông tin liên hệ
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed text-gray-300">
                  123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh, Việt Nam
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <a href="tel:0898451211" className="text-white hover:text-blue-400 font-bold transition-colors">
                  0898.451.211
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-500 mr-3 flex-shrink-0" />
                <a href="mailto:nguyenletuankiet.qng@gmail.com" className="hover:text-white transition-colors text-gray-300">
                  nguyenletuankiet.qng@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-gray-950 py-6 border-t border-gray-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-gray-500 text-center sm:text-left">
            &copy; {currentYear} TechCare IT Services. Bảo lưu mọi quyền.
          </p>
          <p className="text-gray-600 mt-2 sm:mt-0 text-center sm:text-right">
            Thiết kế chuyên nghiệp bởi Kiet IT Services | Bảo mật & Tin cậy.
          </p>
        </div>
      </div>
    </footer>
  );
}
