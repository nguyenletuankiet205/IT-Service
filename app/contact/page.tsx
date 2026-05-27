'use client';

import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ContactForm from '../../components/ContactForm';
import ChatbotWidget from '../../components/ChatbotWidget';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  return (
    <>
      <Header />

      <main className="flex-grow bg-gray-50/50 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>LIÊN HỆ & TƯ VẤN MIỄN PHÍ</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Liên Hệ TechCare IT Services
            </h1>
            <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-medium">
              Gửi yêu cầu tư vấn hoặc mô tả sự cố kỹ thuật. Đội ngũ sẽ phản hồi qua điện thoại hoặc Zalo trong thời gian sớm nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
                <h3 className="font-extrabold text-gray-900 text-sm uppercase tracking-wider">
                  Thông tin liên hệ
                </h3>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 leading-relaxed">
                      123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <a href="tel:0909123456" className="font-bold text-gray-900 hover:text-blue-600">
                      0909.123.456
                    </a>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <a href="mailto:support@techcare.vn" className="text-gray-600 hover:text-blue-600">
                      support@techcare.vn
                    </a>
                  </li>
                </ul>
                <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
                  Giờ hỗ trợ: 08:00 - 20:00 hàng ngày (kể cả Thứ 7, Chủ Nhật)
                </p>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <ContactForm type="contact" source="contact-page" />
              <ContactForm
                type="lead"
                source="contact-page-lead"
                title="Đăng ký nhận báo giá / tư vấn gói dịch vụ"
                description="Dành cho doanh nghiệp, cửa hàng cần báo giá camera, mạng, website hoặc bảo trì IT định kỳ."
              />
            </div>
          </div>
        </div>
      </main>

      <ChatbotWidget />
      <Footer />
    </>
  );
}
