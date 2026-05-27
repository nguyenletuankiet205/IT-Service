'use client';

import React, { useState } from 'react';
import { contactSchema } from '../lib/validators';
import { User, Phone, Mail, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ContactFormProps {
  type?: 'contact' | 'lead';
  source?: string;
  title?: string;
  description?: string;
}

export default function ContactForm({
  type = 'contact',
  source = 'website',
  title,
  description
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    content: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const defaultTitle =
    type === 'lead' ? 'Đăng Ký Tư Vấn Dịch Vụ IT' : 'Gửi Liên Hệ Nhanh';
  const defaultDescription =
    type === 'lead'
      ? 'Để lại thông tin để đội ngũ TechCare tư vấn gói dịch vụ phù hợp nhất với nhu cầu của bạn.'
      : 'Gửi mô tả sự cố hoặc yêu cầu hỗ trợ. Chúng tôi sẽ phản hồi trong vòng 30 phút.';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus(null);
    setFormErrors({});

    const validationResult = contactSchema.safeParse({
      ...formData,
      type,
      source
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach(err => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationResult.data)
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({ full_name: '', phone: '', email: '', content: '' });
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || 'Có lỗi xảy ra. Vui lòng thử lại.'
        });
      }
    } catch {
      setSubmitStatus({
        type: 'error',
        message: 'Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-10">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
            {title || defaultTitle}
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {description || defaultDescription}
          </p>
        </div>

        {submitStatus && (
          <div
            className={`p-4 rounded-2xl flex items-start space-x-3 text-sm border ${
              submitStatus.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="font-medium leading-relaxed">{submitStatus.message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                <User className="h-3.5 w-3.5 mr-1 text-gray-400" />
                <span>Họ và tên *</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Nguyễn Văn A"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  formErrors.full_name
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {formErrors.full_name && (
                <p className="text-xs text-red-500 font-semibold">{formErrors.full_name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                <Phone className="h-3.5 w-3.5 mr-1 text-gray-400" />
                <span>Số điện thoại *</span>
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0909123456"
                className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                  formErrors.phone
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {formErrors.phone && (
                <p className="text-xs text-red-500 font-semibold">{formErrors.phone}</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
              <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>Email (không bắt buộc)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
              <MessageSquare className="h-3.5 w-3.5 mr-1 text-gray-400" />
              <span>
                {type === 'lead' ? 'Mô tả nhu cầu / yêu cầu báo giá *' : 'Nội dung cần tư vấn *'}
              </span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              placeholder={
                type === 'lead'
                  ? 'Ví dụ: Cửa hàng 50m² cần lắp 4 camera, setup Wi-Fi Mesh cho 2 tầng...'
                  : 'Mô tả sự cố hoặc câu hỏi bạn cần hỗ trợ...'
              }
              className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                formErrors.content
                  ? 'border-red-300 focus:ring-red-100'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
              }`}
            />
            {formErrors.content && (
              <p className="text-xs text-red-500 font-semibold">{formErrors.content}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all ${
              loading ? 'opacity-80 cursor-wait' : 'hover:-translate-y-0.5'
            }`}
          >
            {loading ? 'Đang gửi...' : type === 'lead' ? 'Gửi yêu cầu tư vấn' : 'Gửi liên hệ'}
          </button>
        </form>
      </div>
    </div>
  );
}
