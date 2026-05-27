'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { appointmentSchema } from '../lib/validators';
import { Service } from '../lib/types';
import { Calendar, Phone, User, Mail, MapPin, DollarSign, Edit3, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BookingFormProps {
  servicesList?: Service[];
}

export default function BookingForm({ servicesList = [] }: BookingFormProps) {
  const searchParams = useSearchParams();
  const [services, setServices] = useState<Service[]>(servicesList);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Form fields state
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    service_slug: '',
    appointment_date: '',
    appointment_time: '',
    address: '',
    budget_range: '',
    message: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch active services list if not passed from props
  useEffect(() => {
    if (servicesList.length === 0) {
      fetch('/api/services')
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && resData.data) {
            setServices(resData.data);
          }
        })
        .catch((err) => console.error('Error fetching services:', err));
    }
  }, [servicesList]);

  // Pre-select service from URL query parameter ?service=slug
  useEffect(() => {
    const selectedServiceSlug = searchParams.get('service');
    const defaultSlug = selectedServiceSlug || services[0]?.slug;
    if (!defaultSlug) return;

    const id = requestAnimationFrame(() => {
      setFormData(prev => {
        if (prev.service_slug === defaultSlug) return prev;
        return { ...prev, service_slug: defaultSlug };
      });
    });
    return () => cancelAnimationFrame(id);
  }, [searchParams, services]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing
    if (formErrors[name]) {
      setFormErrors((prev) => {
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

    // Validate using Zod schema
    const validationResult = appointmentSchema.safeParse(formData);

    if (!validationResult.success) {
      setLoading(false);
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      setFormErrors(errors);
      
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const errorElement = document.getElementsByName(firstErrorKey)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validationResult.data)
      });

      const resultData = await response.json();

      if (response.ok && resultData.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Đặt lịch thành công! Đội ngũ kỹ thuật viên của TechCare sẽ liên hệ với bạn qua Số điện thoại sớm nhất có thể để xác nhận lịch hẹn.'
        });
        // Reset form
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          service_slug: services[0]?.slug || '',
          appointment_date: '',
          appointment_time: '',
          address: '',
          budget_range: '',
          message: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: resultData.message || 'Có lỗi xảy ra trong quá trình đặt lịch. Vui lòng kiểm tra lại thông tin và thử lại.'
        });
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      setSubmitStatus({
        type: 'error',
        message: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden p-6 sm:p-10 max-w-3xl mx-auto">
      <div className="space-y-6">
        
        {/* Header Description */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Đặt Lịch Hẹn Hỗ Trợ Tận Nơi
          </h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Vui lòng điền đầy đủ các thông tin bên dưới để kỹ thuật viên TechCare chuẩn bị linh kiện thiết bị phù hợp nhất.
          </p>
        </div>

        {/* Status Alerts */}
        {submitStatus && (
          <div
            className={`p-4 sm:p-5 rounded-2xl flex items-start space-x-3 text-sm border ${
              submitStatus.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {submitStatus.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p className="font-medium leading-relaxed">{submitStatus.message}</p>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          
          {/* Section 1: Customer Contact */}
          <div className="bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
              Thông tin liên hệ khách hàng
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Họ tên */}
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
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    formErrors.full_name
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {formErrors.full_name && (
                  <p className="text-xs text-red-500 font-semibold">{formErrors.full_name}</p>
                )}
              </div>

              {/* Số điện thoại */}
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
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
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

            {/* Email (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1 text-gray-400" />
                <span>Địa chỉ Email (Không bắt buộc)</span>
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="nguyenvana@gmail.com"
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  formErrors.email
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {formErrors.email && (
                <p className="text-xs text-red-500 font-semibold">{formErrors.email}</p>
              )}
            </div>
          </div>

          {/* Section 2: Service Details */}
          <div className="bg-gray-50/50 p-4 sm:p-6 rounded-2xl border border-gray-100 space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
              Chi tiết yêu cầu kỹ thuật
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Dịch vụ */}
              <div className="sm:col-span-1 space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                  <Edit3 className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>Dịch vụ cần hỗ trợ *</span>
                </label>
                <select
                  name="service_slug"
                  value={formData.service_slug}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-semibold text-gray-800"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.slug}>
                      {srv.name}
                    </option>
                  ))}
                </select>
                {formErrors.service_slug && (
                  <p className="text-xs text-red-500 font-semibold">{formErrors.service_slug}</p>
                )}
              </div>

              {/* Ngày hẹn */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>Ngày hẹn hỗ trợ *</span>
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                    formErrors.appointment_date
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                />
                {formErrors.appointment_date && (
                  <p className="text-xs text-red-500 font-semibold">{formErrors.appointment_date}</p>
                )}
              </div>

              {/* Giờ hẹn */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                  <span>Giờ hẹn mong muốn *</span>
                </label>
                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border text-sm bg-white transition-all focus:outline-none focus:ring-2 ${
                    formErrors.appointment_time
                      ? 'border-red-300 focus:ring-red-100'
                      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                  }`}
                >
                  <option value="">Chọn khung giờ</option>
                  <option value="08:00 - 10:00">Sáng: 08:00 - 10:00</option>
                  <option value="10:00 - 12:00">Sáng: 10:00 - 12:00</option>
                  <option value="13:00 - 15:00">Chiều: 13:00 - 15:00</option>
                  <option value="15:00 - 17:00">Chiều: 15:00 - 17:00</option>
                  <option value="17:00 - 19:00">Tối: 17:00 - 19:00</option>
                  <option value="19:00 - 21:00">Tối: 19:00 - 21:00</option>
                </select>
                {formErrors.appointment_time && (
                  <p className="text-xs text-red-500 font-semibold">{formErrors.appointment_time}</p>
                )}
              </div>
            </div>

            {/* Địa chỉ thực hiện */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                <span>Địa chỉ tận nơi (Số nhà, Tên đường, Phường, Quận)</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Ví dụ: 123 Lê Lợi, Phường Bến Thành, Quận 1"
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  formErrors.address
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {formErrors.address && (
                <p className="text-xs text-red-500 font-semibold">{formErrors.address}</p>
              )}
            </div>

            {/* Ngân sách dự kiến */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                <DollarSign className="h-3.5 w-3.5 mr-1 text-gray-400" />
                <span>Ngân sách dự kiến của bạn (Không bắt buộc)</span>
              </label>
              <select
                name="budget_range"
                value={formData.budget_range}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
              >
                <option value="">Chọn khoảng ngân sách mong muốn</option>
                <option value="Dưới 300.000đ">Dưới 300.000đ (Sửa lỗi máy tính cơ bản, cài Win)</option>
                <option value="300.000đ - 1.000.000đ">300.000đ - 1.000.000đ (Vệ sinh máy, sửa lỗi mạng LAN)</option>
                <option value="1.000.000đ - 3.000.000đ">1.000.000đ - 3.000.000đ (Lắp camera đơn lẻ, Wi-Fi router)</option>
                <option value="3.000.000đ - 5.000.000đ">3.000.000đ - 5.000.000đ (Lắp trọn bộ camera, làm Landing Page)</option>
                <option value="Trên 5.000.000đ">Trên 5.000.000đ (Website bán hàng, bảo trì hệ thống doanh nghiệp)</option>
              </select>
            </div>

            {/* Mô tả vấn đề */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase flex items-center">
                <Edit3 className="h-3.5 w-3.5 mr-1 text-gray-400" />
                <span>Mô tả chi tiết sự cố / yêu cầu kỹ thuật</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Mô tả cụ thể triệu chứng: Máy bị đơ khi mở Word, camera không nhìn đêm được, cần kéo thêm 2 dây mạng LAN từ tầng 1 lên tầng 2..."
                className={`w-full px-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 ${
                  formErrors.message
                    ? 'border-red-300 focus:ring-red-100'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-100'
                }`}
              />
              {formErrors.message && (
                <p className="text-xs text-red-500 font-semibold">{formErrors.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex justify-center items-center text-base hover:-translate-y-0.5 ${
              loading ? 'opacity-80 cursor-wait' : ''
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Đang xử lý đặt lịch...</span>
              </>
            ) : (
              <span>Xác nhận gửi yêu cầu đặt lịch</span>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
