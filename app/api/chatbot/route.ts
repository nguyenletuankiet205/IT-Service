import { NextResponse } from 'next/server';
import { saveAndReplyToChatMessage } from '../../../lib/chatbot';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_id, message, history } = body;

    if (!session_id || !message) {
      return NextResponse.json(
        {
          success: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin session_id và message.'
        },
        { status: 400 }
      );
    }

    const result = await saveAndReplyToChatMessage(
      session_id,
      message,
      history || []
    );

    return NextResponse.json({
      success: true,
      reply: result.reply
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in POST /api/chatbot:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi máy chủ khi xử lý chatbot',
        error: message
      },
      { status: 500 }
    );
  }
}
