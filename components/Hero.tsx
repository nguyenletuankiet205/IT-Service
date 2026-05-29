'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, MessageSquare, ShieldCheck, Zap, Laptop, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28 lg:py-32 border-b border-gray-100">
      {/* SVG Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-it-bg.svg"
          alt=""
          fill
          className="object-cover opacity-80"
          priority
        />
      </div>

      {/* Extra gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/80 z-[1]" />

      {/* Animated floating accent orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/5 rounded-full blur-3xl animate-pulse z-[1]" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl animate-pulse z-[1]" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-7 sm:space-y-9">
          
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 backdrop-blur-sm border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold tracking-wide shadow-sm">
            <Zap className="h-3.5 w-3.5" />
            <span>HỖ TRỢ IT TẬN NƠI NHANH CHÓNG - CHUYÊN NGHIỆP</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight drop-shadow-sm">
            Dịch vụ IT tận nơi cho{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Cá nhân
            </span>{' '}
            &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Doanh nghiệp
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed font-medium max-w-2xl mx-auto">
            Giải quyết triệt để mọi sự cố kỹ thuật: Cài Windows, sửa máy tính, lắp đặt camera giám sát, tối ưu Wi-Fi yếu, thiết kế website chuẩn SEO và tư vấn hạ tầng Cloud VPS/Domain.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-0.5 group text-base"
            >
              <Calendar className="mr-2 h-5 w-5" />
              <span>Đặt lịch sửa chữa ngay</span>
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>

            <Link
              href="/services"
              className="w-full sm:w-auto inline-flex items-center justify-center bg-white/80 backdrop-blur-sm hover:bg-white text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-bold border border-gray-200 transition-all hover:-translate-y-0.5 text-base shadow-sm"
            >
              <span>Xem danh sách dịch vụ</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-10 sm:pt-14 border-t border-gray-200/60 max-w-2xl mx-auto text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Kỹ thuật viên uy tín</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              <Laptop className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Linh kiện chính hãng</span>
            </div>
            <div className="flex items-center justify-center space-x-2 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Chatbot tư vấn 24/7</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
