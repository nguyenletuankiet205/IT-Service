import { isSupabaseConfigured, supabase } from './supabase';
import { getAdminDataClient } from './supabase-server';
import { DEMO_APPOINTMENTS, DEMO_SERVICES } from './demo-data';
import { Appointment } from './types';
import { getServiceBySlug } from './services';
import { AppointmentInput } from './validators';

// Server-side in-memory store to keep state during Fallback Demo Mode
// This allows the admin dashboard to reflect newly created appointments dynamically.
const demoAppointmentsStore: Appointment[] = [...DEMO_APPOINTMENTS];

/**
 * Creates a new appointment.
 * Automatically resolves the service_id from a service_slug if service_id is not directly provided.
 * In Demo mode, saves to an in-memory cache.
 */
export async function createAppointment(
  input: AppointmentInput
): Promise<{ success: boolean; message: string; data?: Appointment }> {
  let serviceId = input.service_id;
  
  if (!serviceId && input.service_slug) {
    const service = await getServiceBySlug(input.service_slug);
    if (service) {
      serviceId = service.id;
    }
  }

  const defaultService = DEMO_SERVICES.find(s => s.id === serviceId) || DEMO_SERVICES[0];
  
  // Clean structure matching the database schema
  const newAppointmentData: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'service'> = {
    full_name: input.full_name.trim(),
    phone: input.phone.trim(),
    email: input.email ?? undefined,
    service_id: serviceId || defaultService.id,
    appointment_date: input.appointment_date,
    appointment_time: input.appointment_time,
    address: input.address,
    budget_range: input.budget_range || undefined,
    message: input.message,
    status: 'pending' as const,
    estimated_price: defaultService ? defaultService.price_min : undefined
  };

  if (!isSupabaseConfigured) {
    const mockId = `apt-${Date.now()}`;
    const mockCreated = new Date().toISOString();
    const mockAppointment: Appointment = {
      ...newAppointmentData,
      id: mockId,
      created_at: mockCreated,
      updated_at: mockCreated,
      service: defaultService
    };
    // Prepend to display at the top of lists
    demoAppointmentsStore.unshift(mockAppointment);
    
    return {
      success: true,
      message: 'Đặt lịch thành công (Chế độ Demo)',
      data: mockAppointment
    };
  }

  try {
    const { error } = await supabase!
  .from('appointments')
  .insert([newAppointmentData]);

if (error) {
  console.error('Error inserting appointment into Supabase:', error.message);
  return {
    success: false,
    message: `Có lỗi xảy ra: ${error.message}`
  };
}

const mockCreated = new Date().toISOString();

return {
  success: true,
  message: 'Đặt lịch thành công. Chúng tôi sẽ liên hệ lại sớm.',
  data: {
    ...newAppointmentData,
    id: `created-${Date.now()}`,
    created_at: mockCreated,
    updated_at: mockCreated,
    service: defaultService
  } as Appointment
};
  } catch (e: unknown) {
    console.error('Unexpected error creating appointment:', e);
    return {
      success: false,
      message: 'Lỗi hệ thống bất ngờ xảy ra.'
    };
  }
}

/**
 * Retrieves list of appointments for Admin dashboard.
 * Supports status filtering and search query matching full name and phone number.
 */
export async function getAppointments(filters?: { status?: string; search?: string }): Promise<Appointment[]> {
  if (!isSupabaseConfigured) {
    let list = [...demoAppointmentsStore];
    
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(item => item.status === filters.status);
    }
    
    if (filters?.search) {
      const term = filters.search.toLowerCase().trim();
      list = list.filter(item => 
        item.full_name.toLowerCase().includes(term) || 
        item.phone.includes(term) ||
        (item.email && item.email.toLowerCase().includes(term))
      );
    }
    
    return list;
  }

  try {
    // Admin activities should leverage the admin client bypass or base client
    const client = getAdminDataClient() || supabase!;
    let query = client.from('appointments').select('*, service:services(*)');

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    
    if (filters?.search) {
      const searchPattern = `%${filters.search.trim()}%`;
      query = query.or(`full_name.ilike.${searchPattern},phone.ilike.${searchPattern},email.ilike.${searchPattern}`);
    }

    // Newest first
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching appointments from Supabase:', error.message);
      return demoAppointmentsStore;
    }

    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching appointments:', e);
    return demoAppointmentsStore;
  }
}

/**
 * Updates an appointment's state.
 */
export async function updateAppointmentStatus(id: string, status: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    const index = demoAppointmentsStore.findIndex(item => item.id === id);
    if (index !== -1) {
      demoAppointmentsStore[index] = {
        ...demoAppointmentsStore[index],
        status: status as Appointment['status'],
        updated_at: new Date().toISOString()
      };
      return true;
    }
    return false;
  }

  try {
    const client = getAdminDataClient() || supabase!;
    const { error } = await client
      .from('appointments')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      console.error(`Error updating appointment status for ID ${id}:`, error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Unexpected error updating appointment status:', e);
    return false;
  }
}
