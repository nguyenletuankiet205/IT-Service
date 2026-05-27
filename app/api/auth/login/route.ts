import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isSupabaseConfigured } from '../../../../lib/supabase';
import {
  buildAdminSessionCookie,
  DEMO_ADMIN_TOKEN,
  isDemoAuthMode,
  validateDemoCredentials
} from '../../../../lib/auth-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim();
    const password = String(body.password || '');

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập email và mật khẩu.' },
        { status: 400 }
      );
    }

    if (isDemoAuthMode()) {
      if (!validateDemoCredentials(email, password)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Email hoặc mật khẩu không chính xác (Demo: admin@techcare.vn / admin).'
          },
          { status: 401 }
        );
      }

      const response = NextResponse.json({
        success: true,
        message: 'Đăng nhập demo thành công',
        mode: 'demo'
      });
      response.headers.set('Set-Cookie', buildAdminSessionCookie(DEMO_ADMIN_TOKEN));
      return response;
    }

    if (!isSupabaseConfigured) {
      return NextResponse.json(
        { success: false, message: 'Supabase chưa được cấu hình.' },
        { status: 503 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.session) {
      return NextResponse.json(
        { success: false, message: error?.message || 'Đăng nhập thất bại.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      mode: 'production',
      user: { email: data.user?.email }
    });
    response.headers.set('Set-Cookie', buildAdminSessionCookie(data.session.access_token));
    return response;
  } catch (error: unknown) {
    console.error('POST /api/auth/login:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống khi đăng nhập.' },
      { status: 500 }
    );
  }
}
