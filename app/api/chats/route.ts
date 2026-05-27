import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../lib/auth-admin';
import { getChatSessions, getChatMessagesBySessionId } from '../../../lib/chatbot';

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id') || undefined;

    if (sessionId) {
      // Fetch all detailed messages for a specific session
      const messages = await getChatMessagesBySessionId(sessionId);
      return NextResponse.json({
        success: true,
        message: `Lấy lịch sử hội thoại cho session ${sessionId} thành công`,
        data: messages
      });
    }

    // Fetch all chat session summaries for the admin list
    const sessions = await getChatSessions();
    return NextResponse.json({
      success: true,
      message: 'Lấy danh sách phiên chat thành công',
      data: sessions
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in GET /api/chats:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi hệ thống khi truy xuất dữ liệu hội thoại',
        error: message
      },
      { status: 500 }
    );
  }
}
