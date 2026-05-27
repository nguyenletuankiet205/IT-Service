export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string;
  price_min: number;
  price_max: number;
  duration: string;
  category: string;
  icon: string;
  is_active: boolean;
  created_at?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD
  appointment_time: string; // HH:MM
  address?: string;
  budget_range?: string;
  message?: string;
  status: AppointmentStatus;
  estimated_price?: number;
  created_at?: string;
  updated_at?: string;
  service?: Service; // Joined from services
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  session_id: string;
  customer_name?: string;
  customer_phone?: string;
  interested_service?: string;
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
}

export interface ContactLead {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  content: string;
  type: 'contact' | 'lead';
  source?: string;
  status?: 'new' | 'contacted' | 'converted' | 'closed';
  created_at?: string;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
