import { isSupabaseAdminConfigured, supabaseAdmin } from './supabase-admin';

/**
 * Returns Supabase client for privileged server-side admin operations.
 * Uses service role only — never import in client components.
 */
export function getAdminDataClient() {
  if (isSupabaseAdminConfigured && supabaseAdmin) {
    return supabaseAdmin;
  }
  return null;
}
