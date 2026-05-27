'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isSupabaseConfigured } from '../../../lib/supabase';
import { ShieldCheck, Mail, Lock, AlertTriangle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const isDemo = !isSupabaseConfigured;

  useEffect(() => {
    fetch('/api/auth/session', { credentials: 'include' })
      .then(res => {
        if (res.ok) router.replace('/admin');
      })
      .catch(() => undefined);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        sessionStorage.setItem('techcare_admin_logged_in', 'true');
        router.push('/admin');
        router.refresh();
      } else {
        setErrorMsg(result.message || 'Đăng nhập thất bại.');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setErrorMsg('Đã có lỗi kết nối xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)] blur-3xl -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-4">
        <div className="flex justify-center">
          <div className="bg-blue-600 p-3.5 rounded-2xl text-white shadow-xl shadow-blue-900/30">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>

        <div className="text-center space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Đăng Nhập Quản Trị Viên
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Hệ thống quản lý đặt lịch TechCare IT Services
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          {isDemo && (
            <div className="bg-amber-950/40 border border-amber-900/60 p-4 rounded-2xl flex items-start space-x-3 text-xs text-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold uppercase tracking-wider block">Chế độ Demo</span>
                <p className="leading-relaxed">
                  Chưa cấu hình Supabase. Chỉ dùng tài khoản demo:<br />
                  <strong>Email:</strong> admin@techcare.vn<br />
                  <strong>Mật khẩu:</strong> admin
                </p>
              </div>
            </div>
          )}

          {!isDemo && (
            <div className="bg-blue-950/40 border border-blue-900/60 p-4 rounded-2xl text-xs text-blue-200">
              Đăng nhập bằng tài khoản Supabase Auth đã được thêm vào bảng{' '}
              <code className="text-blue-100">admin_profiles</code>.
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-2xl flex items-start space-x-3 text-xs text-red-300">
              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="font-bold leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                <span>Địa chỉ Email *</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@techcare.vn"
                className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:border-blue-500 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition-all font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase flex items-center">
                <Lock className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                <span>Mật khẩu truy cập *</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-800 focus:border-blue-500 bg-slate-950 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/30 transition-all font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/30 transition-all flex justify-center items-center text-sm ${
                loading ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {loading ? 'Đang xác thực thông tin...' : 'Đăng nhập hệ thống'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
