'use client';

import React, { useEffect, useState, useCallback } from 'react';
import LoadingState from '../../../components/LoadingState';
import EmptyState from '../../../components/EmptyState';
import { Customer, ContactLead } from '../../../lib/types';
import { Search } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'customers' | 'leads'>('customers');

  const fetchData = useCallback(() => {
    setLoading(true);
    const params = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : '';

    Promise.all([
      fetch(`/api/customers${params}`, { credentials: 'include' }).then(r => r.json()),
      fetch(`/api/contacts${params}`, { credentials: 'include' }).then(r => r.json())
    ])
      .then(([custRes, leadRes]) => {
        if (custRes.success && custRes.data) setCustomers(custRes.data);
        if (leadRes.success && leadRes.data) setLeads(leadRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Khách Hàng & Liên Hệ
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Quản lý thông tin khách hàng và yêu cầu liên hệ / lead từ website
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm theo tên, SĐT..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-800">
          <button
            type="button"
            onClick={() => setTab('customers')}
            className={`px-4 py-2.5 text-xs font-bold ${
              tab === 'customers' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Khách hàng
          </button>
          <button
            type="button"
            onClick={() => setTab('leads')}
            className={`px-4 py-2.5 text-xs font-bold ${
              tab === 'leads' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-400'
            }`}
          >
            Liên hệ / Lead
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Đang tải dữ liệu..." />
      ) : tab === 'customers' ? (
        customers.length === 0 ? (
          <EmptyState title="Chưa có khách hàng" description="Dữ liệu khách hàng sẽ hiển thị khi có trong hệ thống." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customers.map(c => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
                <p className="font-bold text-white">{c.full_name}</p>
                <p className="text-sm text-slate-400">{c.phone}</p>
                {c.email && <p className="text-xs text-slate-500">{c.email}</p>}
                {c.address && <p className="text-xs text-slate-600">{c.address}</p>}
                {c.note && <p className="text-xs text-slate-500 italic border-t border-slate-800 pt-2">{c.note}</p>}
              </div>
            ))}
          </div>
        )
      ) : leads.length === 0 ? (
        <EmptyState title="Chưa có liên hệ" description="Form liên hệ và lead sẽ lưu tại đây." />
      ) : (
        <div className="space-y-3">
          {leads.map(lead => (
            <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <div className="flex flex-wrap justify-between gap-2 mb-2">
                <p className="font-bold text-white">{lead.full_name}</p>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    lead.type === 'lead'
                      ? 'bg-indigo-950 text-indigo-400'
                      : 'bg-blue-950 text-blue-400'
                  }`}
                >
                  {lead.type === 'lead' ? 'Lead' : 'Liên hệ'}
                </span>
              </div>
              <p className="text-sm text-slate-400">{lead.phone}</p>
              <p className="text-sm text-slate-300 mt-2 leading-relaxed">{lead.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
