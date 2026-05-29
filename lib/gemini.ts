/**
 * Server-side Gemini AI integration for TechCare chatbot.
 * Only used in API routes / server code — never imported in client components.
 *
 * If GEMINI_API_KEY is not set or the API call fails, returns null so the
 * caller can fall back to the rule-based response.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const SYSTEM_PROMPT = `Bạn là trợ lý AI của TechCare IT Services — dịch vụ hỗ trợ kỹ thuật IT tận nơi chuyên nghiệp.

Các dịch vụ TechCare cung cấp:
• Cài đặt Windows 10/11, Microsoft Office, Driver, phần mềm văn phòng
• Sửa chữa máy tính bàn (PC) & Laptop: máy chạy chậm, lỗi phần cứng, virus, màn hình xanh, nóng máy
• Lắp đặt camera giám sát (Wi-Fi xoay 360°, camera IP có đầu ghi)
• Setup Wi-Fi, Router, Mesh, mạng LAN nội bộ, sửa mạng yếu/chập chờn
• Thiết kế website giới thiệu dịch vụ, Landing Page, website doanh nghiệp chuẩn SEO
• Cấu hình VPS Cloud (Windows/Ubuntu), đăng ký Domain, tích hợp Cloudflare CDN, SSL
• Bảo trì IT định kỳ cho văn phòng, doanh nghiệp nhỏ

Quy tắc trả lời:
1. Luôn trả lời bằng tiếng Việt thân thiện, ngắn gọn, dễ hiểu.
2. Khi khách muốn được hỗ trợ, hỏi thêm: họ tên, số điện thoại, dịch vụ cần, khu vực/địa chỉ, thời gian mong muốn.
3. Gợi ý khách truy cập trang /booking để đặt lịch kỹ thuật viên.
4. Gợi ý khách truy cập trang /contact để gửi yêu cầu báo giá.
5. Thông tin liên hệ: Hotline/Zalo 0898.451.211 — Email nguyenletuankiet.qng@gmail.com
6. KHÔNG hướng dẫn hack, bẻ khóa, crack phần mềm, hay bất cứ điều gì bất hợp pháp/nguy hiểm.
7. KHÔNG bịa ra dịch vụ ngoài danh sách trên.
8. Nếu câu hỏi nằm ngoài phạm vi dịch vụ IT, lịch sự từ chối và gợi ý liên hệ hotline.`;

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Call the Gemini API with conversation history and return the AI response.
 * Returns null if the key is missing or the call fails.
 */
export async function getGeminiReply(
  userMessage: string,
  conversationHistory: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string | null> {
  if (!GEMINI_API_KEY) {
    return null;
  }

  try {
    // Build Gemini-format conversation history
    const contents: GeminiMessage[] = [];

    // Add prior conversation turns (skip the initial bot greeting)
    for (const msg of conversationHistory) {
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      });
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 600
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Gemini API error: ${response.status} ${response.statusText}`,
        errorText
      );
      return null;
    }

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      console.error('Gemini API returned no text in response:', JSON.stringify(data).slice(0, 500));
      return null;
    }

    return text.trim();
  } catch (error) {
    console.error('Gemini API call failed:', error);
    return null;
  }
}
