import { isSupabaseConfigured, supabase } from './supabase';
import { getAdminDataClient } from './supabase-server';
import { DEMO_CHAT_MESSAGES, DEMO_CHAT_SESSIONS } from './demo-data';
import { ChatMessage, ChatSession } from './types';
import { getGeminiReply } from './gemini';

const demoChatSessions: ChatSession[] = [...DEMO_CHAT_SESSIONS];
const demoChatMessages: ChatMessage[] = [...DEMO_CHAT_MESSAGES];

export function generateReply(message: string): string {
  const msg = message.toLowerCase().trim();

  if (
    msg.includes('win') ||
    msg.includes('hệ điều hành') ||
    msg.includes('cài lại máy') ||
    msg.includes('cai win') ||
    msg.includes('office') ||
    msg.includes('word') ||
    msg.includes('excel')
  ) {
    return 'Dịch vụ cài Windows tận nhà có giá khoảng 150.000đ - 300.000đ, bao gồm Driver, Office, PDF và phần mềm văn phòng cơ bản. Bạn muốn cài cho PC hay Laptop ạ?';
  }

  if (
    msg.includes('sửa') ||
    msg.includes('sua') ||
    msg.includes('hỏng') ||
    msg.includes('chậm') ||
    msg.includes('lỗi') ||
    msg.includes('đơ') ||
    msg.includes('màn hình xanh') ||
    msg.includes('máy in') ||
    msg.includes('virus') ||
    msg.includes('treo máy') ||
    msg.includes('không lên')
  ) {
    return 'Bên mình nhận kiểm tra và sửa lỗi PC/Laptop tận nơi: máy chậm, lỗi phần mềm, virus, máy in, màn hình xanh, nóng máy. Giá thường từ 100.000đ - 500.000đ tùy tình trạng. Máy của bạn đang bị lỗi gì ạ?';
  }

  if (
    msg.includes('camera') ||
    msg.includes('cam') ||
    msg.includes('giám sát') ||
    msg.includes('giam sat') ||
    msg.includes('đầu ghi')
  ) {
    return 'TechCare hỗ trợ lắp camera Wi-Fi và camera IP có đầu ghi. Camera Wi-Fi trọn gói từ khoảng 900.000đ/camera, hệ thống IP từ khoảng 1.800.000đ/mắt. Bạn cần lắp mấy camera và ở khu vực nào ạ?';
  }

  if (
    msg.includes('wifi') ||
    msg.includes('wi-fi') ||
    msg.includes('mạng') ||
    msg.includes('mang') ||
    msg.includes('router') ||
    msg.includes('switch') ||
    msg.includes('mesh') ||
    msg.includes('rớt mạng') ||
    msg.includes('yếu')
  ) {
    return 'Dịch vụ setup Wi-Fi/mạng hỗ trợ router, Wi-Fi Mesh, LAN, switch, máy in mạng và xử lý Wi-Fi yếu/chập chờn. Chi phí khoảng 150.000đ - 800.000đ tùy số lượng thiết bị và độ phức tạp.';
  }

  if (
    msg.includes('web') ||
    msg.includes('website') ||
    msg.includes('trang web') ||
    msg.includes('thiết kế') ||
    msg.includes('thiet ke') ||
    msg.includes('landing')
  ) {
    return 'TechCare nhận thiết kế website giới thiệu dịch vụ, Landing Page, website doanh nghiệp chuẩn SEO. Chi phí tham khảo từ 2.200.000đ - 10.000.000đ+ tùy chức năng. Bạn muốn làm web lĩnh vực nào ạ?';
  }

  if (
    msg.includes('vps') ||
    msg.includes('cloud') ||
    msg.includes('domain') ||
    msg.includes('tên miền') ||
    msg.includes('cloudflare') ||
    msg.includes('hosting') ||
    msg.includes('ssl')
  ) {
    return 'TechCare hỗ trợ VPS Windows/Ubuntu, domain, Cloudflare, DNS, CDN và SSL HTTPS. Chi phí tư vấn/cấu hình từ khoảng 200.000đ - 1.000.000đ. Bạn đang cần triển khai hạng mục nào ạ?';
  }

  if (
    msg.includes('bảo trì') ||
    msg.includes('bao tri') ||
    msg.includes('định kỳ') ||
    msg.includes('it outsource') ||
    msg.includes('bảo dưỡng')
  ) {
    return 'Dịch vụ bảo trì IT định kỳ phù hợp cho văn phòng, shop và doanh nghiệp nhỏ: kiểm tra máy tính, mạng, máy in, sao lưu dữ liệu. Giá từ khoảng 500.000đ/tháng tùy số lượng thiết bị.';
  }

  if (
    msg.includes('đặt lịch') ||
    msg.includes('dat lich') ||
    msg.includes('hẹn') ||
    msg.includes('booking') ||
    msg.includes('kỹ thuật viên') ||
    msg.includes('tận nơi')
  ) {
    return 'Bạn có thể đặt lịch tại trang /booking. Bạn cũng có thể để lại họ tên, số điện thoại, khu vực/địa chỉ và thời gian mong muốn để bên mình liên hệ xác nhận.';
  }

  if (
    msg.includes('giá') ||
    msg.includes('gia') ||
    msg.includes('bao nhiêu') ||
    msg.includes('chi phí') ||
    msg.includes('bảng giá') ||
    msg.includes('báo giá')
  ) {
    return 'Bảng giá tham khảo: cài Windows 150.000đ - 300.000đ, sửa máy tính từ 100.000đ, lắp camera từ 900.000đ, setup Wi-Fi từ 150.000đ, website từ 2.200.000đ. Bạn mô tả nhu cầu cụ thể để mình tư vấn sát hơn nhé.';
  }

  if (
    msg.includes('liên hệ') ||
    msg.includes('lien he') ||
    msg.includes('sđt') ||
    msg.includes('hotline') ||
    msg.includes('zalo') ||
    msg.includes('email')
  ) {
    return 'Bạn có thể liên hệ TechCare qua Hotline/Zalo 0898.451.211 hoặc email nguyenletuankiet.qng@gmail.com. Thời gian hỗ trợ: 8:00 - 20:00 hằng ngày.';
  }

  if (
    msg.includes('chào') ||
    msg.includes('chao') ||
    msg.includes('hello') ||
    msg.includes('hi') ||
    msg.includes('alo') ||
    msg.includes('tư vấn') ||
    msg.includes('tu van')
  ) {
    return 'Xin chào! Mình là trợ lý TechCare IT Services. Bạn cần tư vấn cài Windows, sửa máy tính, lắp camera, setup Wi-Fi, làm website hay VPS/domain/Cloudflare ạ?';
  }

  return 'Dạ, TechCare có thể hỗ trợ các dịch vụ IT như cài Windows, sửa máy tính, lắp camera, setup Wi-Fi, thiết kế website, VPS/domain/Cloudflare và bảo trì IT. Bạn cho mình biết nhu cầu cụ thể nhé.';
}

export async function saveAndReplyToChatMessage(
  sessionId: string,
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<{ reply: string }> {
  const geminiReply = await getGeminiReply(userMessage, conversationHistory);

  let botReply: string;

  if (geminiReply) {
    console.log('Gemini reply used');
    botReply = geminiReply;
  } else {
    console.log('Gemini failed, fallback used');
    botReply = generateReply(userMessage);
  }

  let interestedService = '';
  const msgLower = userMessage.toLowerCase();

  if (msgLower.includes('win') || msgLower.includes('office')) {
    interestedService = 'Cài Windows & Phần mềm';
  } else if (msgLower.includes('sửa') || msgLower.includes('chậm') || msgLower.includes('hỏng')) {
    interestedService = 'Sửa máy tính & Laptop';
  } else if (msgLower.includes('camera') || msgLower.includes('cam')) {
    interestedService = 'Lắp camera';
  } else if (msgLower.includes('wifi') || msgLower.includes('mạng')) {
    interestedService = 'Setup Wi-Fi & Mạng';
  } else if (msgLower.includes('web')) {
    interestedService = 'Thiết kế website';
  } else if (msgLower.includes('vps') || msgLower.includes('domain')) {
    interestedService = 'VPS/Domain Cloud';
  } else if (msgLower.includes('bảo trì')) {
    interestedService = 'Bảo trì IT';
  }

  if (!isSupabaseConfigured) {
    let session = demoChatSessions.find(s => s.session_id === sessionId);

    if (!session) {
      session = {
        id: `cs-${Date.now()}`,
        session_id: sessionId,
        customer_name: 'Khách hàng vãng lai',
        customer_phone: undefined,
        interested_service: interestedService || undefined,
        created_at: new Date().toISOString()
      };
      demoChatSessions.push(session);
    } else if (interestedService && !session.interested_service) {
      session.interested_service = interestedService;
    }

    const phoneMatch = userMessage.match(/(0|\+84)[3|5|7|8|9][0-9]{8}/);

    if (phoneMatch && !session.customer_phone) {
      session.customer_phone = phoneMatch[0];
      session.customer_name = `Khách hàng (${phoneMatch[0]})`;
    }

    demoChatMessages.push(
      {
        id: `cm-${Date.now()}-user`,
        session_id: sessionId,
        role: 'user',
        content: userMessage,
        created_at: new Date().toISOString()
      },
      {
        id: `cm-${Date.now()}-bot`,
        session_id: sessionId,
        role: 'assistant',
        content: botReply,
        created_at: new Date().toISOString()
      }
    );

    return { reply: botReply };
  }

  try {
    const client = getAdminDataClient() || supabase!;

    const { data: existingSession, error: sessionFindError } = await client
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (sessionFindError) {
      console.error('Error finding chat session in Supabase:', sessionFindError.message);
    }

    let sessionData = existingSession;

    if (!sessionData) {
      const { error: sessionCreateError } = await client.from('chat_sessions').insert([
        {
          session_id: sessionId,
          customer_name: 'Khách hàng vãng lai',
          interested_service: interestedService || null
        }
      ]);

      if (sessionCreateError) {
        console.error('Error creating chat session in Supabase:', sessionCreateError.message);
      } else {
        sessionData = {
          session_id: sessionId,
          customer_name: 'Khách hàng vãng lai',
          interested_service: interestedService || null
        };
      }
    } else if (interestedService && !sessionData.interested_service) {
      await client
        .from('chat_sessions')
        .update({ interested_service: interestedService })
        .eq('session_id', sessionId);
    }

    const phoneMatch = userMessage.match(/(0|\+84)[3|5|7|8|9][0-9]{8}/);

    if (phoneMatch && sessionData && !sessionData.customer_phone) {
      await client
        .from('chat_sessions')
        .update({
          customer_phone: phoneMatch[0],
          customer_name: `Khách hàng (${phoneMatch[0]})`
        })
        .eq('session_id', sessionId);
    }

    const { error: msgInsertError } = await client.from('chat_messages').insert([
      { session_id: sessionId, role: 'user', content: userMessage },
      { session_id: sessionId, role: 'assistant', content: botReply }
    ]);

    if (msgInsertError) {
      console.error('Error inserting chat messages into Supabase:', msgInsertError.message);
    }

    return { reply: botReply };
  } catch (e) {
    console.error('Unexpected error in saveAndReplyToChatMessage:', e);
    return { reply: botReply };
  }
}

export async function getChatSessions(): Promise<ChatSession[]> {
  if (!isSupabaseConfigured) {
    return [...demoChatSessions].sort(
      (a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
  }

  try {
    const client = getAdminDataClient() || supabase!;

    const { data, error } = await client
      .from('chat_sessions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat sessions from Supabase:', error.message);
      return demoChatSessions;
    }

    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching chat sessions:', e);
    return demoChatSessions;
  }
}

export async function getChatMessagesBySessionId(sessionId: string): Promise<ChatMessage[]> {
  if (!isSupabaseConfigured) {
    return demoChatMessages
      .filter(msg => msg.session_id === sessionId)
      .sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
  }

  try {
    const client = getAdminDataClient() || supabase!;

    const { data, error } = await client
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(`Error fetching chat messages for session ${sessionId} from Supabase:`, error.message);
      return demoChatMessages.filter(msg => msg.session_id === sessionId);
    }

    return data || [];
  } catch (e) {
    console.error('Unexpected error fetching chat messages:', e);
    return demoChatMessages.filter(msg => msg.session_id === sessionId);
  }
}