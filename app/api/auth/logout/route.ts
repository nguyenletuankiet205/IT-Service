import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../../../../lib/supabase';
import {
  clearAdminSessionCookie,
  getAdminSessionToken,
  isDemoAuthMode
} from '../../../../lib/auth-admin';

export async function POST(request: Request) {
  try {
    const token = getAdminSessionToken(request);

    if (!isDemoAuthMode() && isSupabaseConfigured && token) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );
      await supabase.auth.signOut();
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đã đăng xuất'
    });
    response.headers.set('Set-Cookie', clearAdminSessionCookie());
    return response;
  } catch (error: unknown) {
    console.error('POST /api/auth/logout:', error);
    const response = NextResponse.json(
      { success: false, message: 'Lỗi khi đăng xuất.' },
      { status: 500 }
    );
    response.headers.set('Set-Cookie', clearAdminSessionCookie());
    return response;
  }
}
