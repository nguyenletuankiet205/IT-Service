import { isSupabaseConfigured, supabase } from './supabase';
import { getAdminDataClient } from './supabase-server';
import { DEMO_CONTACT_LEADS } from './demo-data';
import { ContactLead } from './types';
import { ContactInput } from './validators';

const demoContactsStore: ContactLead[] = [...DEMO_CONTACT_LEADS];

export async function createContactLead(
  input: ContactInput
): Promise<{ success: boolean; message: string; data?: ContactLead }> {
  const record: Omit<ContactLead, 'id' | 'created_at'> = {
    full_name: input.full_name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    content: input.content.trim(),
    type: input.type || 'contact',
    source: input.source || 'website',
    status: 'new'
  };

  if (!isSupabaseConfigured) {
    const mock: ContactLead = {
      ...record,
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    demoContactsStore.unshift(mock);

    return {
      success: true,
      message:
        input.type === 'lead'
          ? 'Gửi yêu cầu tư vấn thành công (Chế độ Demo). Chúng tôi sẽ liên hệ sớm nhất!'
          : 'Gửi liên hệ thành công (Chế độ Demo). Cảm ơn bạn đã liên hệ TechCare!',
      data: mock
    };
  }

  try {
    const payload = {
      full_name: record.full_name,
      phone: record.phone,
      email: record.email || null,
      content: record.content,
      type: record.type,
      source: record.source,
      status: record.status
    };

    const { error } = await supabase!
      .from('contact_leads')
      .insert([payload]);

    if (error) {
      console.error('Error inserting contact/lead:', error.message);
      return {
        success: false,
        message: `Có lỗi xảy ra: ${error.message}`
      };
    }

    const mock: ContactLead = {
      ...record,
      id: `lead-${Date.now()}`,
      created_at: new Date().toISOString()
    };

    return {
      success: true,
      message: 'Gửi thông tin thành công. Đội ngũ TechCare sẽ liên hệ với bạn sớm nhất!',
      data: mock
    };
  } catch (e) {
    console.error('Unexpected error creating contact/lead:', e);
    return {
      success: false,
      message: 'Lỗi hệ thống bất ngờ xảy ra.'
    };
  }
}

export async function getContactLeads(filters?: {
  type?: string;
  search?: string;
}): Promise<ContactLead[]> {
  if (!isSupabaseConfigured) {
    let list = [...demoContactsStore];

    if (filters?.type && filters.type !== 'all') {
      list = list.filter(item => item.type === filters.type);
    }

    if (filters?.search) {
      const term = filters.search.toLowerCase().trim();
      list = list.filter(
        item =>
          item.full_name.toLowerCase().includes(term) ||
          item.phone.includes(term) ||
          item.content.toLowerCase().includes(term)
      );
    }

    return list;
  }

  try {
    const client = getAdminDataClient() || supabase!;

    let query = client
      .from('contact_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters?.search) {
      const pattern = `%${filters.search.trim()}%`;
      query = query.or(
        `full_name.ilike.${pattern},phone.ilike.${pattern},content.ilike.${pattern}`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching contact leads:', error.message);
      return demoContactsStore;
    }

    return (data as ContactLead[]) || demoContactsStore;
  } catch (e) {
    console.error('Unexpected error fetching contact leads:', e);
    return demoContactsStore;
  }
}