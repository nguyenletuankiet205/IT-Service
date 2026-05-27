import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/auth-admin';
import { appointmentSchema } from '../../../lib/validators';
import { createAppointment, getAppointments } from '../../../lib/appointments';

/**
 * GET /api/appointments
 * Retrieves list of appointments for the admin, supporting search and status filtering.
 */
export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const appointments = await getAppointments({ status, search });
    
    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách lịch hẹn thành công',
      data: appointments
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/appointments:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Có lỗi xảy ra khi tải danh sách lịch hẹn',
        error: message
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments
 * Submits a new appointment with validation.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = appointmentSchema.safeParse(body);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.format();
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu nhập vào không hợp lệ',
          errors: formattedErrors
        },
        { status: 400 }
      );
    }

    // Call appointment creation service logic
    const result = await createAppointment(validationResult.data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in POST /api/appointments:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi hệ thống bất ngờ xảy ra khi đặt lịch',
        error: message
      },
      { status: 500 }
    );
  }
}
