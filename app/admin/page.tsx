'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardCard from '../../components/DashboardCard';
import LoadingState from '../../components/LoadingState';
import StatusBadge from '../../components/StatusBadge';
import { Appointment } from '../../lib/types';
import { formatDate, formatPrice } from '../../lib/utils';
import { DEMO_SERVICES } from '../../lib/demo-data';
import { ArrowRight } from 'lucide-react';

export default function AdminDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/appointments', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setAppointments(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    inProgress: appointments.filter(a => a.status === 'in_progress').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    revenue: appointments
      .filter(a => a.status === 'completed' || a.status === 'confirmed' || a.status === 'in_progress')
      .reduce((sum, a) => sum + (a.estimated_price || 0), 0)
  };

  const serviceCounts: Record<string, number> = {};
  appointments.forEach(apt => {
    const name =
      apt.service?.name ||
      DEMO_SERVICES.find(s => s.id === apt.service_id)?.name ||
      'Khác';
    serviceCounts[name] = (serviceCounts[name] || 0) + 1;
  });
  const topService = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1])[0];

  const recent = appointments.slice(0, 5);

  if (loading) {
    return <LoadingState message="Đang tải dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Tổng Quan Hệ Thống
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Thống kê lịch hẹn, doanh thu dự kiến và hoạt động gần đây
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <DashboardCard title="Tổng lịch hẹn" value={stats.total} icon="Calendar" color="blue" />
        <DashboardCard title="Chờ xử lý" value={stats.pending} icon="Clock" color="amber" />
        <DashboardCard title="Đã xác nhận" value={stats.confirmed} icon="CheckCircle2" color="indigo" />
        <DashboardCard title="Đang xử lý" value={stats.inProgress} icon="PlayCircle" color="blue" />
        <DashboardCard title="Hoàn thành" value={stats.completed} icon="CheckCircle2" color="emerald" />
        <DashboardCard title="Đã hủy" value={stats.cancelled} icon="XCircle" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Doanh thu dự kiến
          </h3>
          <p className="text-3xl font-extrabold text-emerald-400">{formatPrice(stats.revenue)}</p>
          <p className="text-xs text-slate-500">
            Tính từ các lịch đã xác nhận, đang xử lý và hoàn thành
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Dịch vụ được đặt nhiều nhất
          </h3>
          <p className="text-xl font-extrabold text-white">
            {topService ? topService[0] : 'Chưa có dữ liệu'}
          </p>
          {topService && (
            <p className="text-xs text-slate-500">{topService[1]} lịch hẹn</p>
          )}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-white text-sm sm:text-base">Lịch hẹn mới nhất</h3>
          <Link
            href="/admin/appointments"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-950/50">
              <tr>
                <th className="px-6 py-3">Khách hàng</th>
                <th className="px-6 py-3 hidden sm:table-cell">Ngày hẹn</th>
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                    Chưa có lịch hẹn nào
                  </td>
                </tr>
              ) : (
                recent.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-800/30">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-200">{apt.full_name}</p>
                      <p className="text-xs text-slate-500">{apt.phone}</p>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-slate-400">
                      {formatDate(apt.appointment_date)} — {apt.appointment_time}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
