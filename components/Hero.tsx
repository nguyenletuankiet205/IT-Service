'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MessageSquare, ShieldCheck, Zap, Laptop, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-gray-100">
      {/* Visual background decorations */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f4f8_1px,transparent_1px),linear-gradient(to_bottom,#f0f4f8_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="absolute -top-40 left-1/2 -z-10 h-[600px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_50%)] blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-8">
          
          {/* Top Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide animate-pulse">
            <Zap className="h-3.5 w-3.5" />
            <span>HỖ TRỢ IT TẬN NƠI NHANH CHÓNG - CHUYÊN NGHIỆP</span>
          </div>

          {/* Hero Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
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
          <p className="text-base sm:text-lg lg:text-xl text-gray-500 leading-relaxed font-medium">
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
              className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 px-8 py-4 rounded-xl font-bold border border-gray-200 transition-all hover:-translate-y-0.5 text-base"
            >
              <span>Xem danh sách dịch vụ</span>
            </Link>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 sm:pt-12 border-t border-gray-100 max-w-2xl mx-auto text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <ShieldCheck className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Kỹ thuật viên uy tín</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Laptop className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Linh kiện chính hãng</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Chatbot tư vấn 24/7</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
