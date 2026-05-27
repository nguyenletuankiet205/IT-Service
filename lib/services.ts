import { isSupabaseConfigured, supabase } from './supabase';
import { DEMO_SERVICES } from './demo-data';
import { Service } from './types';

/**
 * Retrieves all active services, ordered by creation time.
 * Falls back to demo data if Supabase is not configured.
 */
export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) {
    return DEMO_SERVICES;
  }

  try {
    const { data, error } = await supabase!
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching services from Supabase, falling back to demo data:', error.message);
      return DEMO_SERVICES;
    }

    return data && data.length > 0 ? data : DEMO_SERVICES;
  } catch (e) {
    console.error('Unexpected error fetching services, falling back to demo data:', e);
    return DEMO_SERVICES;
  }
}

/**
 * Retrieves a single active service by its unique slug identifier.
 * Falls back to demo data search if Supabase is not configured.
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (!isSupabaseConfigured) {
    return DEMO_SERVICES.find(s => s.slug === slug) || null;
  }

  try {
    const { data, error } = await supabase!
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error(`Error fetching service by slug ${slug}, falling back to demo data:`, error.message);
      return DEMO_SERVICES.find(s => s.slug === slug) || null;
    }

    return data || DEMO_SERVICES.find(s => s.slug === slug) || null;
  } catch (e) {
    console.error('Unexpected error fetching service by slug, falling back to demo data:', e);
    return DEMO_SERVICES.find(s => s.slug === slug) || null;
  }
}
