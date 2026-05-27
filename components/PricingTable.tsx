'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, Calendar, ArrowRight } from 'lucide-react';

interface PriceItem {
  name: string;
  price: string;
  notes?: string;
}

interface PriceCategory {
  title: string;
  items: PriceItem[];
}

export default function PricingTable() {
  const priceCategories: PriceCategory[] = [
    {
      title: 'Cài đặt hệ điều hành & Phần mềm',
      items: [
        { name: 'Cài Windows 10 / 11 + Driver', price: '150.000đ - 250.000đ', notes: 'Tối ưu hiệu năng, đầy đủ Driver' },
        { name: 'Cài Windows + Office + Phần mềm văn phòng cơ bản', price: '200.000đ - 300.000đ', notes: 'Gói khuyến nghị cho học tập, làm việc' },
        { name: 'Cài Windows + Phần mềm đồ họa chuyên dụng (Adobe, CAD)', price: '300.000đ - 500.000đ', notes: 'Phù hợp designer, kỹ sư, dựng phim' }
      ]
    },
    {
      title: 'Sửa lỗi máy tính & Vệ sinh phần cứng',
      items: [
        { name: 'Khắc phục lỗi phần mềm & Sửa máy tính cơ bản', price: '100.000đ - 300.000đ', notes: 'Lỗi win chập chờn, lỗi Driver, máy in' },
        { name: 'Vệ sinh Laptop & Bôi keo tản nhiệt MX-4 cao cấp', price: '250.000đ - 400.000đ', notes: 'Khuyên dùng định kỳ 6-12 tháng' },
        { name: 'Trọn gói: Cài đặt hệ điều hành + Vệ sinh Laptop', price: '350.000đ - 600.000đ', notes: 'Tiết kiệm chi phí, hồi sinh máy chạy nhanh' }
      ]
    },
    {
      title: 'Lắp đặt Camera giám sát',
      items: [
        { name: 'Lắp đặt Camera Wi-Fi không dây độc lập (trong nhà/ngoài trời)', price: '900.000đ - 1.800.000đ / mắt', notes: 'Đã bao gồm camera thông minh, thẻ nhớ, công lắp' },
        { name: 'Lắp đặt hệ thống Camera IP trọn bộ 1 mắt (có đầu ghi)', price: '1.800.000đ - 2.800.000đ / mắt', notes: 'Có đầu ghi hình, ổ cứng lưu trữ, độ ổn định cao' },
        { name: 'Gói hệ thống 4 Camera IP trọn bộ cho cửa hàng, nhà xưởng', price: '3.200.000đ - 5.900.000đ', notes: 'Đầy đủ đầu thu, ổ cứng, phụ kiện thi công lắp đặt' }
      ]
    },
    {
      title: 'Thiết kế mạng & Wi-Fi chuyên nghiệp',
      items: [
        { name: 'Cấu hình thiết bị mạng Router / Wi-Fi Mesh', price: '150.000đ - 500.000đ', notes: 'Tối ưu vùng phủ sóng, giảm nhiễu' },
        { name: 'Setup hệ thống mạng LAN nội bộ quy mô vừa và nhỏ', price: '500.000đ - 2.000.000đ', notes: 'Chạy dây mạng LAN, cấu hình switch chia mạng' }
      ]
    },
    {
      title: 'Thiết kế Website & Landing Page',
      items: [
        { name: 'Thiết kế Website giới thiệu dịch vụ / Landing Page cơ bản', price: '2.200.000đ - 5.000.000đ', notes: 'Tặng kèm 1 năm hosting + tên miền quốc tế, chuẩn SEO' },
        { name: 'Thiết kế Website doanh nghiệp / Web bán hàng nâng cao', price: '5.000.000đ - 10.000.000đ+', notes: 'Giao diện độc quyền, tích hợp giỏ hàng, thanh toán' }
      ]
    },
    {
      title: 'Hạ tầng Cloud & Bảo trì IT Outsource',
      items: [
        { name: 'Tư vấn, cấu hình Cloud VPS / Domain / SSL / Cloudflare', price: '200.000đ - 1.000.000đ', notes: 'Deploy web, bảo mật chống DDOS, cấu hình CDN' },
        { name: 'Bảo trì IT Outsource định kỳ doanh nghiệp nhỏ & Cửa hàng', price: 'Báo giá theo số thiết bị', notes: 'Hợp đồng bảo trì định kỳ tháng, hỗ trợ khẩn cấp tận nơi' }
      ]
    }
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Disclaimer Alert */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl flex items-start space-x-3 shadow-sm">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm text-amber-800 font-medium leading-relaxed">
          Giá chỉ mang tính tham khảo. Chi phí thực tế có thể thay đổi tùy tình trạng thiết bị, khu vực hỗ trợ và yêu cầu cụ thể. TechCare cam kết kiểm tra báo giá trước khi làm, không phát sinh chi phí ẩn.
        </p>
      </div>

      {/* Table grid */}
      <div className="space-y-8">
        {priceCategories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-gray-300 transition-colors">
            
            {/* Header Category */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 uppercase tracking-wide">
                {cat.title}
              </h3>
            </div>

            {/* List Table Items */}
            <div className="divide-y divide-gray-150">
              {cat.items.map((item, itemIdx) => (
                <div
                  key={itemIdx}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-50/50 transition-colors gap-3"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                      {item.name}
                    </h4>
                    {item.notes && (
                      <p className="text-xs text-gray-400 font-medium">
                        {item.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="font-extrabold text-sm sm:text-base text-blue-600 bg-blue-50/60 px-3 py-1.5 rounded-lg border border-blue-50">
                      {item.price}
                    </span>
                    <Link
                      href="/booking"
                      className="hidden sm:inline-flex items-center text-xs font-bold text-gray-400 hover:text-blue-600 transition-colors group"
                    >
                      <span>Đặt lịch</span>
                      <ArrowRight className="h-3.5 w-3.5 ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

      {/* Pricing CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl shadow-blue-100">
        <h3 className="text-2xl sm:text-3xl font-extrabold">Cần một bảng báo giá IT chi tiết riêng biệt?</h3>
        <p className="max-w-xl mx-auto text-sm sm:text-base text-blue-100 leading-relaxed">
          Hãy để lại thông tin lỗi hoặc số lượng thiết bị của doanh nghiệp bạn. Kỹ thuật viên sẽ khảo sát miễn phí và gửi báo giá chi tiết trong vòng 30 phút.
        </p>
        <div>
          <Link
            href="/booking"
            className="inline-flex items-center bg-white hover:bg-blue-50 text-blue-600 px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Calendar className="mr-2 h-5 w-5" />
            <span>Liên hệ khảo sát & báo giá</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
