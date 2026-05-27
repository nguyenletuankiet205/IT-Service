'use client';

import React, { useEffect, useState } from 'react';
import LoadingState from '../../../components/LoadingState';
import EmptyState from '../../../components/EmptyState';
import { Service } from '../../../lib/types';
import { formatPrice } from '../../../lib/utils';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { AlertTriangle } from 'lucide-react';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setServices(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Quản Lý Dịch Vụ
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Danh sách dịch vụ hiển thị trên website (chỉnh sửa qua Supabase khi đã kết nối)
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="bg-amber-950/40 border border-amber-900/60 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-300">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Chế độ Demo: dữ liệu dịch vụ lấy từ file mẫu. Kết nối Supabase và cập nhật bảng{' '}
            <code className="text-amber-200">services</code> để quản lý trực tiếp trên database.
          </p>
        </div>
      )}

      {loading ? (
        <LoadingState message="Đang tải dịch vụ..." />
      ) : services.length === 0 ? (
        <EmptyState title="Chưa có dịch vụ" description="Thêm dịch vụ vào Supabase hoặc bật demo data." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(srv => (
            <div
              key={srv.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3"
            >
              <div className="flex justify-between items-start gap-2">
                <h3 className="font-bold text-white text-sm sm:text-base">{srv.name}</h3>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    srv.is_active
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {srv.is_active ? 'Đang hiển thị' : 'Ẩn'}
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{srv.description}</p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                <span>
                  Giá: {formatPrice(srv.price_min)} — {formatPrice(srv.price_max)}
                </span>
                <span>• {srv.duration}</span>
                <span>• {srv.slug}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
