import { isSupabaseConfigured, supabase } from './supabase';
import { getAdminDataClient } from './supabase-server';
import { DEMO_CUSTOMERS } from './demo-data';
import { Customer } from './types';

export async function getCustomers(search?: string): Promise<Customer[]> {
  if (!isSupabaseConfigured) {
    let list = [...DEMO_CUSTOMERS];
    if (search) {
      const term = search.toLowerCase().trim();
      list = list.filter(
        item =>
          item.full_name.toLowerCase().includes(term) ||
          item.phone.includes(term) ||
          (item.email && item.email.toLowerCase().includes(term))
      );
    }
    return list;
  }

  try {
    const client = getAdminDataClient() || supabase!;
    let query = client.from('customers').select('*').order('created_at', { ascending: false });

    if (search) {
      const pattern = `%${search.trim()}%`;
      query = query.or(`full_name.ilike.${pattern},phone.ilike.${pattern},email.ilike.${pattern}`);
    }

    const { data, error } = await query;
    if (error) {
      console.error('Error fetching customers:', error.message);
      return DEMO_CUSTOMERS;
    }
    return (data as Customer[])?.length ? (data as Customer[]) : DEMO_CUSTOMERS;
  } catch (e) {
    console.error('Unexpected error fetching customers:', e);
    return DEMO_CUSTOMERS;
  }
}
