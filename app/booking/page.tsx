'use client';

import React, { Suspense } from 'react';
import LoadingState from '../../components/LoadingState';
import Header from '../../components/Header';
import BookingForm from '../../components/BookingForm';
import ChatbotWidget from '../../components/ChatbotWidget';
import Footer from '../../components/Footer';
import { Calendar } from 'lucide-react';

export default function BookingPage() {
  return (
    <>
      <Header />
      
      <main className="flex-grow bg-gray-50/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Page Banner Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              <Calendar className="h-3.5 w-3.5" />
              <span>ĐẶT LỊCH HẸN TRỰC TUYẾN 24/7</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Đăng Ký Kỹ Thuật Viên Tận Nơi
            </h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed font-medium">
              Chỉ mất 1 phút để gửi yêu cầu hỗ trợ. Kỹ thuật viên TechCare sẽ liên hệ ngay để chốt lịch và di chuyển qua sửa chữa cho bạn.
            </p>
          </div>

          {/* Booking Form component */}
          <div className="max-w-3xl mx-auto">
            <Suspense fallback={<LoadingState message="Đang tải form đặt lịch..." />}>
              <BookingForm />
            </Suspense>
          </div>

        </div>
      </main>

      <ChatbotWidget />
      
      <Footer />
    </>
  );
}
