import { NextResponse } from 'next/server';
import { getServices } from '../../../lib/services';

export async function GET() {
  try {
    const services = await getServices();
    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách dịch vụ thành công',
      data: services
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/services:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi tải danh sách dịch vụ',
        error: message
      },
      { status: 500 }
    );
  }
}
