'use client';

import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import ServiceCard from '../../components/ServiceCard';
import ChatbotWidget from '../../components/ChatbotWidget';
import Footer from '../../components/Footer';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { Service } from '../../lib/types';
import { ShieldCheck, Cpu } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setServices(resData.data);
        }
      })
      .catch((err) => console.error('Error fetching services:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header />
      
      <main className="flex-grow bg-gray-50/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Banner Header */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              <Cpu className="h-3.5 w-3.5" />
              <span>UY TÍN - NHANH CHÓNG - CHUYÊN NGHIỆP</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Danh Sách Dịch Vụ IT Tận Nơi
            </h1>
            <p className="text-sm sm:text-base text-gray-500 leading-relaxed font-medium">
              TechCare cam kết hỗ trợ khắc phục nhanh nhất mọi sự cố liên quan đến Máy tính, Mạng nội bộ, Camera giám sát và giải pháp Cloud/Website cho bạn.
            </p>
          </div>

          {/* Services Grid */}
          {loading ? (
            <LoadingState />
          ) : services.length === 0 ? (
            <EmptyState 
              title="Chưa có dịch vụ nào" 
              description="Hiện tại hệ thống dịch vụ đang được cập nhật thêm. Quý khách vui lòng liên hệ hotline để biết thêm chi tiết."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {services.map((srv) => (
                <ServiceCard key={srv.id} service={srv} />
              ))}
            </div>
          )}

          {/* Warranty Commitment banner */}
          <div className="bg-white rounded-3xl border border-gray-150 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-sm max-w-4xl mx-auto gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl flex-shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm sm:text-base text-gray-900">Cam Kết Chất Lượng Vượt Trội</h4>
                <p className="text-xs sm:text-sm text-gray-500 max-w-xl leading-relaxed">
                  Tất cả các dịch vụ cài đặt phần mềm và thay thế phần cứng tại TechCare đều đi kèm chính sách hỗ trợ kỹ thuật từ xa miễn phí và bảo hành chính hãng uy tín.
                </p>
              </div>
            </div>
            <div className="text-xs sm:text-sm text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl flex-shrink-0">
              Hotline 24/7: 0909.123.456
            </div>
          </div>

        </div>
      </main>

      <ChatbotWidget />
      
      <Footer />
    </>
  );
}
