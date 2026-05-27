import { z } from 'zod';

export const appointmentSchema = z.object({
  full_name: z.string()
    .min(1, 'Vui lòng nhập họ tên')
    .max(100, 'Họ tên không được dài quá 100 ký tự')
    .transform(val => val.trim()),
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^(0|\+84)[1-9][0-9]{8}$/, 'Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0909123456)')
    .transform(val => val.trim()),
  email: z.string()
    .email('Email không đúng định dạng')
    .optional()
    .or(z.literal(''))
    .transform(val => val ? val.trim().toLowerCase() : undefined),
  service_id: z.string()
    .optional()
    .or(z.literal('')),
  service_slug: z.string().optional().or(z.literal('')),
  appointment_date: z.string()
    .min(1, 'Vui lòng chọn ngày hẹn hỗ trợ'),
  appointment_time: z.string()
    .min(1, 'Vui lòng chọn giờ hẹn'),
  address: z.string()
    .max(255, 'Địa chỉ không được dài quá 255 ký tự')
    .optional()
    .or(z.literal(''))
    .transform(val => val ? val.trim() : undefined),
  budget_range: z.string()
    .optional()
    .or(z.literal('')),
  message: z.string()
    .max(1000, 'Nội dung mô tả không được dài quá 1000 ký tự')
    .optional()
    .or(z.literal(''))
    .transform(val => val ? val.trim() : undefined)
}).refine(
  data => !!(data.service_id?.trim() || data.service_slug?.trim()),
  { message: 'Vui lòng chọn dịch vụ cần hỗ trợ', path: ['service_slug'] }
);

export type AppointmentInput = z.infer<typeof appointmentSchema>;

export const contactSchema = z.object({
  full_name: z.string()
    .min(1, 'Vui lòng nhập họ tên')
    .max(100, 'Họ tên không được dài quá 100 ký tự')
    .transform(val => val.trim()),
  phone: z.string()
    .min(1, 'Vui lòng nhập số điện thoại')
    .regex(/^(0|\+84)[1-9][0-9]{8}$/, 'Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0909123456)')
    .transform(val => val.trim()),
  email: z.string()
    .email('Email không đúng định dạng')
    .optional()
    .or(z.literal(''))
    .transform(val => val ? val.trim().toLowerCase() : undefined),
  content: z.string()
    .min(5, 'Nội dung cần ít nhất 5 ký tự')
    .max(1000, 'Nội dung không được dài quá 1000 ký tự')
    .transform(val => val.trim()),
  type: z.enum(['contact', 'lead']).optional().default('contact'),
  source: z.string().optional()
});

export type ContactInput = z.infer<typeof contactSchema>;
