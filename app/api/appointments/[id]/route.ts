import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/auth-admin';
import { updateAppointmentStatus } from '../../../../lib/appointments';
import { AppointmentStatus } from '../../../../lib/types';

const VALID_STATUSES: AppointmentStatus[] = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    // Next.js 15+ has asynchronous params. This safe-resolution handles both sync and async params.
    const params = await (context.params instanceof Promise ? context.params : Promise.resolve(context.params));
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Mã lịch đặt hẹn không hợp lệ' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status as AppointmentStatus)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Trạng thái cập nhật không hợp lệ. Các trạng thái hợp lệ gồm: pending, confirmed, in_progress, completed, cancelled.' 
        },
        { status: 400 }
      );
    }

    const success = await updateAppointmentStatus(id, status);

    if (!success) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy lịch hẹn hoặc không thể cập nhật trạng thái' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Cập nhật trạng thái lịch hẹn thành công',
      data: { id, status }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in PATCH /api/appointments/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi hệ thống khi cập nhật lịch hẹn',
        error: message
      },
      { status: 500 }
    );
  }
}
