import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  ADMIN_SESSION_COOKIE,
  DEMO_ADMIN_TOKEN,
  isDemoAuthMode
} from './lib/auth-admin';

function isSupabaseEnvConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    url !== 'your_supabase_project_url' &&
    url.trim() !== ''
  );
}

async function isValidProductionSession(token: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return false;

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    const admin = createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
    const { data: profile } = await admin
      .from('admin_profiles')
      .select('role')
      .eq('id', data.user.id)
      .maybeSingle();
    return !!profile && profile.role === 'admin';
  }

  // If service role is not set, allow any valid authenticated user (document in README)
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') || pathname === '/admin/login') {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isDemoAuthMode()) {
    if (token === DEMO_ADMIN_TOKEN) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (!isSupabaseEnvConfigured()) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (token === DEMO_ADMIN_TOKEN) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const valid = await isValidProductionSession(token);
  if (!valid) {
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.set(ADMIN_SESSION_COOKIE, '', { path: '/', maxAge: 0 });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Protect all /admin routes except /admin/login
  matcher: ['/admin', '/admin/((?!login$).*)']
};
