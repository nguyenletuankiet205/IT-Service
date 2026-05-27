import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/auth-admin';
import { contactSchema } from '../../../lib/validators';
import { createContactLead, getContactLeads } from '../../../lib/contacts';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = await getContactLeads({ type, search });

    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách liên hệ thành công',
      data
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/contacts:', error);
    return NextResponse.json(
      { success: false, message: 'Có lỗi xảy ra khi tải danh sách liên hệ', error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validationResult = contactSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dữ liệu nhập vào không hợp lệ',
          errors: validationResult.error.format()
        },
        { status: 400 }
      );
    }

    const result = await createContactLead(validationResult.data);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in POST /api/contacts:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống khi gửi liên hệ', error: message },
      { status: 500 }
    );
  }
}
