'use client';

import React, { useEffect, useState, useCallback } from 'react';
import LoadingState from '../../../components/LoadingState';
import EmptyState from '../../../components/EmptyState';
import StatusBadge from '../../../components/StatusBadge';
import { Appointment, AppointmentStatus } from '../../../lib/types';
import { formatDate, formatPrice } from '../../../lib/utils';
import { DEMO_SERVICES } from '../../../lib/demo-data';
import { Search, RefreshCw } from 'lucide-react';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'pending', label: 'Chờ xử lý' },
  { value: 'confirmed', label: 'Đã xác nhận' },
  { value: 'in_progress', label: 'Đang xử lý' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (search.trim()) params.set('search', search.trim());

    fetch(`/api/appointments?${params.toString()}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setAppointments(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchAppointments, 300);
    return () => clearTimeout(timer);
  }, [fetchAppointments]);

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(prev =>
          prev.map(apt => (apt.id === id ? { ...apt, status } : apt))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getServiceName = (apt: Appointment) =>
    apt.service?.name || DEMO_SERVICES.find(s => s.id === apt.service_id)?.name || '—';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Quản Lý Lịch Hẹn
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Tìm kiếm, lọc và cập nhật trạng thái lịch đặt hẹn
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT, email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={fetchAppointments}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold flex items-center justify-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </button>
      </div>

      {loading ? (
        <LoadingState message="Đang tải lịch hẹn..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="Không có lịch hẹn"
          description="Chưa có lịch hẹn phù hợp với bộ lọc hiện tại."
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-slate-500 uppercase bg-slate-950/50">
                <tr>
                  <th className="px-4 py-3 text-left">Khách hàng</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Dịch vụ</th>
                  <th className="px-4 py-3 text-left hidden lg:table-cell">Ngày / Giờ</th>
                  <th className="px-4 py-3 text-left hidden xl:table-cell">Giá dự kiến</th>
                  <th className="px-4 py-3 text-left">Trạng thái</th>
                  <th className="px-4 py-3 text-left">Cập nhật</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {appointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-slate-800/20">
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-200">{apt.full_name}</p>
                      <p className="text-xs text-slate-500">{apt.phone}</p>
                      {apt.message && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-1 max-w-xs">
                          {apt.message}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-slate-400">
                      {getServiceName(apt)}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-slate-400">
                      {formatDate(apt.appointment_date)}
                      <br />
                      <span className="text-xs">{apt.appointment_time}</span>
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell text-emerald-400 font-semibold">
                      {apt.estimated_price ? formatPrice(apt.estimated_price) : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={apt.status} />
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={apt.status}
                        disabled={updatingId === apt.id}
                        onChange={e =>
                          handleStatusChange(apt.id, e.target.value as AppointmentStatus)
                        }
                        className="text-xs bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-blue-500 disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.filter(o => o.value !== 'all').map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
