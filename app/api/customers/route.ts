import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/auth-admin';
import { getCustomers } from '../../../lib/customers';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;

    const data = await getCustomers(search);

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách khách hàng thành công',
      data
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/customers:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi tải danh sách khách hàng', error: message },
      { status: 500 }
    );
  }
}
