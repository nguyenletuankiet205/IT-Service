import { isSupabaseConfigured, supabase } from './supabase';
import { getAdminDataClient } from './supabase-server';
import { DEMO_CHAT_MESSAGES, DEMO_CHAT_SESSIONS } from './demo-data';
import { ChatMessage, ChatSession } from './types';

// Server-side in-memory cache for storing chatbot conversations in Fallback Demo Mode
const demoChatSessions: ChatSession[] = [...DEMO_CHAT_SESSIONS];
const demoChatMessages: ChatMessage[] = [...DEMO_CHAT_MESSAGES];

/**
 * Evaluates the user's message using Vietnamese keywords to return the correct scripted response.
 */
export function generateReply(message: string): string {
  const msg = message.toLowerCase().trim();

  // 1. Cài Windows
  if (
    msg.includes('win') || 
    msg.includes('hệ điều hành') || 
    msg.includes('cài lại máy') || 
    msg.includes('cai win') ||
    msg.includes('office') || 
    msg.includes('word') || 
    msg.includes('excel')
  ) {
    return 'Dịch vụ cài Windows tận nhà có giá khoảng 150.000đ - 300.000đ (đã bao gồm đầy đủ Driver, Microsoft Office, PDF và các phần mềm văn phòng cơ bản). Bên mình hỗ trợ cài Windows 10 và Windows 11 sạch sẽ, mượt mà. Bạn muốn cài cho máy tính bàn hay Laptop ạ?';
  }

  // 2. Sửa máy tính
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
    msg.includes('bị đơ') ||
    msg.includes('không lên')
  ) {
    return 'Bên mình nhận kiểm tra, khắc phục lỗi phần cứng, phần mềm tận nơi cho cả PC và Laptop: Máy chạy chậm, nóng máy, dọn dẹp virus, lỗi máy in không kết nối, lỗi phần mềm văn phòng. Giá dao động từ 100.000đ - 500.000đ tùy tình trạng thực tế. Bạn có thể cho mình biết cụ thể máy đang gặp hiện tượng gì không?';
  }

  // 3. Lắp camera
  if (
    msg.includes('camera') || 
    msg.includes('cam') || 
    msg.includes('giám sát') || 
    msg.includes('giam sat') ||
    msg.includes('đầu ghi') ||
    msg.includes('nhìn trộm')
  ) {
    return 'TechCare chuyên thi công camera giám sát. Có 2 gói chính cho bạn lựa chọn:\n- Camera Wi-Fi không dây xoay 360 độ (phù hợp nhà riêng, cửa hàng nhỏ): giá từ 900.000đ/camera trọn gói lắp đặt.\n- Hệ thống camera IP có đầu ghi ổ cứng lưu trữ lâu dài (phù hợp kho bãi, văn phòng lớn): giá từ 1.800.000đ/mắt camera.\nBạn cần lắp đặt ở khu vực nào và lắp bao nhiêu mắt ạ?';
  }

  // 4. Setup Wi-Fi / mạng
  if (
    msg.includes('wifi') || 
    msg.includes('wi-fi') || 
    msg.includes('mạng') || 
    msg.includes('mang') ||
    msg.includes('router') || 
    msg.includes('switch') || 
    msg.includes('phát sóng') || 
    msg.includes('rớt mạng') ||
    msg.includes('yếu') ||
    msg.includes('mesh')
  ) {
    return 'Dịch vụ setup Wi-Fi và mạng của TechCare xử lý triệt để các lỗi Wi-Fi chập chờn, mạng yếu bằng cách lắp đặt Router chịu tải tốt, cấu hình Wi-Fi Mesh đồng nhất, chia sẻ máy in mạng nội bộ, đi dây mạng LAN thẩm mỹ. Chi phí khoảng 150.000đ - 800.000đ tùy thuộc vào số lượng thiết bị và độ phức tạp của công trình.';
  }

  // 5. Thiết kế website
  if (
    msg.includes('web') || 
    msg.includes('website') || 
    msg.includes('trang web') || 
    msg.includes('thiết kế') || 
    msg.includes('thiet ke') ||
    msg.includes('landing')
  ) {
    return 'TechCare nhận thiết kế Website giới thiệu dịch vụ, Landing Page bán hàng hoặc Website doanh nghiệp chuẩn SEO, hiển thị mượt mà trên điện thoại. Chi phí tham khảo:\n- Landing Page/Web giới thiệu cơ bản: 2.200.000đ - 5.000.000đ.\n- Web bán hàng, tin tức nâng cao: 5.000.000đ - 10.000.000đ+.\nBạn muốn làm web thuộc lĩnh vực nào ạ?';
  }

  // 6. VPS / Domain / Cloudflare
  if (
    msg.includes('vps') || 
    msg.includes('cloud') || 
    msg.includes('domain') || 
    msg.includes('tên miền') || 
    msg.includes('ten mien') ||
    msg.includes('cloudflare') || 
    msg.includes('hosting') || 
    msg.includes('ssl') ||
    msg.includes('bảo mật')
  ) {
    return 'TechCare hỗ trợ cấu hình và cài đặt VPS Cloud (Windows/Ubuntu), đăng ký và trỏ tên miền (Domain), tích hợp Cloudflare (CDN, chống DDOS, DNS) để website chạy nhanh và bảo mật hơn, cài đặt SSL HTTPS miễn phí. Chi phí từ 200.000đ - 1.000.000đ. Bạn đang cần triển khai cụ thể hạng mục nào ạ?';
  }

  // 7. Bảo trì IT định kỳ
  if (
    msg.includes('bảo trì') || 
    msg.includes('bao tri') ||
    msg.includes('định kỳ') || 
    msg.includes('outsource') || 
    msg.includes('it outsource') ||
    msg.includes('bảo dưỡng')
  ) {
    return 'Dịch vụ bảo trì IT định kỳ của TechCare cực kỳ phù hợp cho các văn phòng, shop bán hàng và doanh nghiệp nhỏ. Kỹ thuật viên sẽ kiểm tra định kỳ hàng tháng phần mềm, tối ưu mạng Wi-Fi, máy in, sao lưu dữ liệu phòng tránh hư hỏng. Giá từ 500.000đ/tháng dựa trên số lượng máy tính và thiết bị của quý khách. Văn phòng của bạn có bao nhiêu máy cần bảo trì ạ?';
  }

  // 8. Đặt lịch
  if (
    msg.includes('đặt lịch') || 
    msg.includes('dat lich') ||
    msg.includes('hẹn') || 
    msg.includes('booking') || 
    msg.includes('kỹ thuật viên') ||
    msg.includes('qua sửa') ||
    msg.includes('tận nơi')
  ) {
    return 'Để đặt lịch kỹ thuật viên hỗ trợ nhanh nhất, quý khách có thể nhấp vào nút "Đặt lịch ngay" phía dưới hoặc truy cập trang `/booking` trên thanh menu để điền thông tin nhanh. Bạn cũng có thể nhắn thẳng Số điện thoại và địa chỉ tại đây, nhân viên bên mình sẽ lập tức liên hệ gọi điện xác nhận!';
  }

  // 9. Bảng giá
  if (
    msg.includes('giá') || 
    msg.includes('gia') ||
    msg.includes('bao nhiêu') || 
    msg.includes('chi phí') || 
    msg.includes('bảng giá') || 
    msg.includes('bang gia') ||
    msg.includes('báo giá') ||
    msg.includes('tốn nhiêu')
  ) {
    return 'Bảng giá dịch vụ IT tham khảo của TechCare:\n- Cài Windows 10/11 + Office: 200.000đ - 300.000đ\n- Sửa lỗi máy tính cơ bản: từ 100.000đ\n- Lắp đặt camera giám sát Wi-Fi: từ 900.000đ\n- Setup Wi-Fi / Router / LAN: từ 150.000đ\n- Thiết kế Website doanh nghiệp: từ 2.200.000đ\nQuý khách có thể xem bảng giá đầy đủ tại trang `/pricing` hoặc cho bên mình biết thiết bị của bạn đang gặp lỗi cụ thể gì để được báo giá chính xác nhất ạ.';
  }

  // 10. Liên hệ
  if (
    msg.includes('liên hệ') || 
    msg.includes('lien he') ||
    msg.includes('sđt') || 
    msg.includes('hotline') || 
    msg.includes('địa chỉ') || 
    msg.includes('dia chi') ||
    msg.includes('điện thoại') ||
    msg.includes('facebook') ||
    msg.includes('zalo')
  ) {
    return 'Quý khách có thể liên hệ trực tiếp với TechCare IT Services qua:\n- Hotline/Zalo hỗ trợ kỹ thuật: 0909.123.456\n- Email: support@techcare.vn\n- Trụ sở chính: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh.\nThời gian hỗ trợ tận nơi: 8:00 - 20:00 tất cả các ngày trong tuần (kể cả Thứ 7, Chủ Nhật và ngày lễ).';
  }

  // Chào hỏi
  if (
    msg.includes('chào') || 
    msg.includes('chao') ||
    msg.includes('hello') || 
    msg.includes('hi') || 
    msg.includes('alo') || 
    msg.includes('admin') ||
    msg.includes('tư vấn') ||
    msg.includes('tu van')
  ) {
    return 'Xin chào! Mình là Chatbot hỗ trợ tự động của TechCare IT Services. Mình có thể giúp gì cho bạn hôm nay?\nBạn có thể hỏi mình về bảng giá, cách đặt lịch, hoặc tư vấn cài Win, sửa máy tính, lắp camera, sửa Wi-Fi yếu, làm website...';
  }

  return 'Dạ, TechCare có thể giúp gì cho bạn ạ? Bên mình cung cấp các dịch vụ IT tận nhà như cài Windows, sửa máy tính chạy chậm, lắp đặt camera, cấu hình Wi-Fi, thiết kế website, tư vấn Cloud VPS và tên miền. Quý khách có thể nêu rõ nhu cầu hoặc để lại số điện thoại để nhân viên kỹ thuật liên hệ tư vấn trực tiếp cho bạn nhé!';
}

/**
 * Handles chatbot messages.
 * Logs conversations into Supabase if configured, or saves them to our local in-memory store in Demo fallback mode.
 */
export async function saveAndReplyToChatMessage(
  sessionId: string, 
  userMessage: string
): Promise<{ reply: string }> {
  const botReply = generateReply(userMessage);

  // 1. Determine interested service from message content
  let interestedService = '';
  const msgLower = userMessage.toLowerCase();
  if (msgLower.includes('win') || msgLower.includes('office')) interestedService = 'Cài Windows & Phần mềm';
  else if (msgLower.includes('sửa') || msgLower.includes('chậm') || msgLower.includes('hỏng')) interestedService = 'Sửa máy tính & Laptop';
  else if (msgLower.includes('camera') || msgLower.includes('cam')) interestedService = 'Lắp camera';
  else if (msgLower.includes('wifi') || msgLower.includes('mạng')) interestedService = 'Setup Wi-Fi & Mạng';
  else if (msgLower.includes('web')) interestedService = 'Thiết kế website';
  else if (msgLower.includes('vps') || msgLower.includes('domain')) interestedService = 'VPS/Domain Cloud';
  else if (msgLower.includes('bảo trì')) interestedService = 'Bảo trì IT';

  if (!isSupabaseConfigured) {
    // 2. Demo fallback save logic
    // Create session if not existing
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

    // Attempt to extract phone number from message
    const phoneMatch = userMessage.match(/(0|\+84)[3|5|7|8|9][0-9]{8}/);
    if (phoneMatch && !session.customer_phone) {
      session.customer_phone = phoneMatch[0];
      session.customer_name = `Khách hàng (${phoneMatch[0]})`;
    }

    // Save messages
    const userMsgObj: ChatMessage = {
      id: `cm-${Date.now()}-user`,
      session_id: sessionId,
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    
    const botMsgObj: ChatMessage = {
      id: `cm-${Date.now()}-bot`,
      session_id: sessionId,
      role: 'assistant',
      content: botReply,
      created_at: new Date().toISOString()
    };

    demoChatMessages.push(userMsgObj, botMsgObj);
    return { reply: botReply };
  }

  try {
    // 3. Supabase save logic
    // Select or create session
    const { data: existingSessions, error: sessionFindError } = await supabase!
      .from('chat_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .maybeSingle();

    if (sessionFindError) {
      console.error('Error finding chat session in Supabase:', sessionFindError.message);
    }

    let sessionData = existingSessions;

    if (!sessionData) {
      const { data: newSession, error: sessionCreateError } = await supabase!
        .from('chat_sessions')
        .insert([{
          session_id: sessionId,
          customer_name: 'Khách hàng vãng lai',
          interested_service: interestedService || null
        }])
        .select('*')
        .single();

      if (sessionCreateError) {
        console.error('Error creating chat session in Supabase:', sessionCreateError.message);
      } else {
        sessionData = newSession;
      }
    } else if (interestedService && !sessionData.interested_service) {
      // Update interested service if it wasn't set yet
      await supabase!
        .from('chat_sessions')
        .update({ interested_service: interestedService })
        .eq('session_id', sessionId);
    }

    // Check if message contains phone number and update session
    const phoneMatch = userMessage.match(/(0|\+84)[3|5|7|8|9][0-9]{8}/);
    if (phoneMatch && sessionData && !sessionData.customer_phone) {
      await supabase!
        .from('chat_sessions')
        .update({ 
          customer_phone: phoneMatch[0],
          customer_name: `Khách hàng (${phoneMatch[0]})`
        })
        .eq('session_id', sessionId);
    }

    // Insert user and assistant messages
    const { error: msgInsertError } = await supabase!
      .from('chat_messages')
      .insert([
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

/**
 * Gets chat sessions list for admin panel.
 */
export async function getChatSessions(): Promise<ChatSession[]> {
  if (!isSupabaseConfigured) {
    return [...demoChatSessions].sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
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

/**
 * Gets message history for a specific chat session.
 */
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
