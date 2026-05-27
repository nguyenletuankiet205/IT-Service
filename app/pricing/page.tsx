'use client';

import React from 'react';
import Header from '../../components/Header';
import PricingTable from '../../components/PricingTable';
import ChatbotWidget from '../../components/ChatbotWidget';
import Footer from '../../components/Footer';
import { Tag } from 'lucide-react';

export default function PricingPage() {
  return (
    <>
      <Header />
      
      <main className="flex-grow bg-gray-50/50 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Banner Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              <Tag className="h-3.5 w-3.5" />
              <span>MINH BẠCH - HỢP LÝ - KHÔNG PHÁT SINH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Bảng Giá Dịch Vụ IT Tham Khảo
            </h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto leading-relaxed font-medium">
              TechCare cung cấp bảng giá chi tiết cho từng dịch vụ hỗ trợ kỹ thuật máy tính, lắp đặt camera và thi công mạng.
            </p>
          </div>

          {/* Detailed Pricing Table */}
          <PricingTable />

        </div>
      </main>

      <ChatbotWidget />
      
      <Footer />
    </>
  );
}
