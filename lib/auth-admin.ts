import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from './supabase';
import { isSupabaseAdminConfigured, supabaseAdmin } from './supabase-admin';

export const ADMIN_SESSION_COOKIE = 'techcare_admin_session';
export const DEMO_ADMIN_TOKEN = 'demo-session-token';
export const DEMO_ADMIN_EMAIL = 'admin@techcare.vn';
export const DEMO_ADMIN_PASSWORD = 'admin';

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export function isDemoAuthMode(): boolean {
  return !isSupabaseConfigured;
}

export function parseCookies(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=');
    if (key) acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

export function getAdminSessionToken(request: Request): string | undefined {
  const fromCookie = parseCookies(request.headers.get('cookie'))[ADMIN_SESSION_COOKIE];
  if (fromCookie) return fromCookie;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  return undefined;
}

export type AdminAuthResult =
  | { ok: true; mode: 'demo' }
  | { ok: true; mode: 'production'; userId: string; email?: string }
  | { ok: false };

/**
 * Verifies admin session from httpOnly cookie or Authorization header.
 * Demo mode: accepts DEMO_ADMIN_TOKEN only when Supabase env is missing.
 */
export async function verifyAdminSession(request: Request): Promise<AdminAuthResult> {
  const token = getAdminSessionToken(request);

  if (isDemoAuthMode()) {
    if (token === DEMO_ADMIN_TOKEN) {
      return { ok: true, mode: 'demo' };
    }
    return { ok: false };
  }

  if (!token || token === DEMO_ADMIN_TOKEN) {
    return { ok: false };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const authClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) {
    return { ok: false };
  }

  if (isSupabaseAdminConfigured && supabaseAdmin) {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError || !profile || profile.role !== 'admin') {
      return { ok: false };
    }
  }

  return {
    ok: true,
    mode: 'production',
    userId: data.user.id,
    email: data.user.email
  };
}

export function unauthorizedAdminResponse(message = 'Yêu cầu đăng nhập quản trị viên') {
  return NextResponse.json({ success: false, message }, { status: 401 });
}

export async function requireAdmin(
  request: Request
): Promise<AdminAuthResult | NextResponse> {
  const auth = await verifyAdminSession(request);
  if (!auth.ok) {
    return unauthorizedAdminResponse();
  }
  return auth;
}

export function buildAdminSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${secure}`;
}

export function clearAdminSessionCookie(): string {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function validateDemoCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_ADMIN_EMAIL &&
    password === DEMO_ADMIN_PASSWORD
  );
}
