import { NextResponse } from 'next/server';
import { verifyAdminSession } from '../../../../lib/auth-admin';

export async function GET(request: Request) {
  const auth = await verifyAdminSession(request);

  if (!auth.ok) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    authenticated: true,
    mode: auth.mode,
    email: auth.mode === 'production' ? auth.email : 'admin@techcare.vn (demo)'
  });
}
