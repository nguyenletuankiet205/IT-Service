'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import BookingForm from '../components/BookingForm';
import PricingTable from '../components/PricingTable';
import { Suspense } from 'react';
import ChatbotWidget from '../components/ChatbotWidget';
import Footer from '../components/Footer';
import LoadingState from '../components/LoadingState';
import { Service } from '../lib/types';
import { ShieldCheck, Zap, DollarSign, Award, Clock, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch only top 3 services for highlights
  useEffect(() => {
    fetch('/api/services')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setServices(resData.data.slice(0, 3));
        }
      })
      .catch((err) => console.error('Error fetching services:', err))
      .finally(() => setLoading(false));
  }, []);

  const whyChooseUs = [
    {
      title: 'Hỗ trợ cực tốc',
      description: 'Kỹ thuật viên sẽ có mặt tận nơi trong vòng 30 - 45 phút ngay sau khi xác nhận lịch đặt hẹn.',
      icon: Zap,
      color: 'text-amber-500 bg-amber-50'
    },
    {
      title: 'Đội ngũ chuyên nghiệp',
      description: 'Kỹ thuật viên được đào tạo bài bản, trung thực, giàu kinh nghiệm sửa lỗi PC/Laptop/Mạng.',
      icon: ShieldCheck,
      color: 'text-blue-500 bg-blue-50'
    },
    {
      title: 'Báo giá minh bạch',
      description: 'Cam kết báo giá rõ ràng trước khi thực hiện. Tuyệt đối không phát sinh phụ phí ẩn.',
      icon: DollarSign,
      color: 'text-emerald-500 bg-emerald-50'
    },
    {
      title: 'Linh kiện chính hãng',
      description: 'Linh kiện thay thế có nguồn gốc rõ ràng, bảo hành chính hãng từ 6 - 24 tháng cực uy tín.',
      icon: Award,
      color: 'text-indigo-500 bg-indigo-50'
    },
    {
      title: 'Tư vấn tận tâm 24/7',
      description: 'Hệ thống chatbot tư vấn kỹ thuật trực tuyến và hotline luôn sẵn sàng lắng nghe mọi sự cố.',
      icon: Clock,
      color: 'text-purple-500 bg-purple-50'
    },
    {
      title: 'Đồng hành bền vững',
      description: 'Chính sách chăm sóc chu đáo, hỗ trợ từ xa miễn phí qua UltraViewer/TeamViewer sau khi sửa.',
      icon: Users,
      color: 'text-pink-500 bg-pink-50'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Đặt lịch hoặc Chat',
      description: 'Bạn chọn dịch vụ mong muốn, điền thông tin đặt lịch trên website hoặc trò chuyện với trợ lý chatbot.'
    },
    {
      step: '02',
      title: 'Xác nhận yêu cầu',
      description: 'Đội ngũ tư vấn viên TechCare gọi điện thoại xác nhận tình trạng lỗi, báo giá dự kiến và chốt giờ hẹn.'
    },
    {
      step: '03',
      title: 'Xử lý tận nơi',
      description: 'Kỹ thuật viên di chuyển tới tận nhà kiểm tra thiết bị, báo giá chính xác và tiến hành xử lý lỗi.'
    },
    {
      step: '04',
      title: 'Nghiệm thu & Thanh toán',
      description: 'Khách hàng kiểm tra thiết bị chạy ổn định, ký biên bản nghiệm thu và thanh toán. Bảo hành chu đáo.'
    }
  ];

  return (
    <>
      <Header />
      
      <main className="flex-grow">
        
        {/* Hero Section */}
        <Hero />

        {/* Highlighted Services Section */}
        <section className="py-16 sm:py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Dịch Vụ Kỹ Thuật Tiêu Biểu
              </h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Chúng tôi cung cấp các gói dịch vụ IT tận nhà linh hoạt, giải quyết nhanh chóng mọi nhu cầu của bạn.
              </p>
            </div>

            {loading ? (
              <LoadingState />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {services.map((srv) => (
                  <ServiceCard key={srv.id} service={srv} />
                ))}
              </div>
            )}

            <div className="text-center pt-4">
              <Link
                href="/services"
                className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-6 py-3 rounded-xl transition-all"
              >
                <span>Khám phá tất cả dịch vụ IT</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

          </div>
        </section>

        {/* Work Process Section */}
        <section className="py-16 sm:py-24 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Quy Trình Hỗ Trợ 4 Bước Chuyên Nghiệp
              </h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Từ khâu tiếp nhận đến khi hoàn tất bàn giao, TechCare luôn cam kết dịch vụ nhanh chóng và đơn giản nhất.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {steps.map((item, index) => {
                const IconComponent = index === 0 ? Zap : index === 1 ? Clock : index === 2 ? ShieldCheck : Award;
                return (
                  <div key={index} className="space-y-4 relative group">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl sm:text-5xl font-black text-blue-100 leading-none group-hover:text-blue-200 transition-colors">
                        {item.step}
                      </div>
                      <div className="h-0.5 bg-gray-100 flex-grow hidden lg:block" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900 flex items-center">
                        <IconComponent className="h-4 w-4 text-blue-500 mr-2" />
                        <span>{item.title}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 sm:py-24 bg-gray-50/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
            
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Tại Sao Nên Chọn TechCare IT Services?
              </h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Sự hài lòng và tin cậy của quý khách hàng là tôn chỉ hoạt động hàng đầu của chúng tôi.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {whyChooseUs.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-150 p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-3 rounded-xl inline-block ${item.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-16 sm:py-24 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Bảng Giá Tham Khảo
              </h2>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
                Xem mức giá dự kiến cho các dịch vụ IT phổ biến. Chi phí thực tế được báo trước khi thực hiện.
              </p>
            </div>
            <PricingTable />
          </div>
        </section>

        {/* Embedded Booking Form Section */}
        <section id="booking-section" className="py-16 sm:py-24 bg-gray-50/50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<LoadingState message="Đang tải form đặt lịch..." />}>
              <BookingForm />
            </Suspense>
          </div>
        </section>

      </main>

      {/* Floating Chatbot */}
      <ChatbotWidget />

      <Footer />
    </>
  );
}
