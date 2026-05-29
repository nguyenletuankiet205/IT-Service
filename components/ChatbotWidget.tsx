'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageCircle, X, Send, Bot, User, Calendar, RefreshCw } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => {
    if (typeof window === 'undefined') return '';
    let saved = sessionStorage.getItem('techcare_chat_session_id');
    if (!saved) {
      saved = `session-${Math.random().toString(36).substring(2, 11)}`;
      sessionStorage.setItem('techcare_chat_session_id', saved);
    }
    return saved;
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [history, setHistory] = useState<ChatMessage[]>(() => [
    {
      role: 'assistant',
      content:
        'Xin chào! Mình là Chatbot hỗ trợ tự động của TechCare IT Services. Mình có thể tư vấn giá cả, giải pháp sửa mạng, cài Win, lắp camera, làm website... Bạn đang cần hỗ trợ vấn đề gì ạ?'
    }
  ]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  const quickSuggestions = [
    'Cài Windows',
    'Sửa máy tính',
    'Lắp camera',
    'Sửa Wi-Fi chập chờn',
    'Làm website',
    'Bảng giá',
    'Số điện thoại liên hệ'
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const updatedHistory = [...history, { role: 'user', content: textToSend } as ChatMessage];
    setHistory(updatedHistory);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: textToSend,
          history: updatedHistory.slice(-10).map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setHistory(prev => [
          ...prev,
          {
            role: 'assistant',
            content:
              'Dạ xin lỗi anh/chị, hệ thống chatbot đang bảo trì đột xuất. Anh/chị có thể liên hệ trực tiếp Hotline 0898.451.211 để kỹ thuật viên hỗ trợ ngay ạ!'
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
      setHistory(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Kết nối mạng gián đoạn. Anh/chị vui lòng thử lại hoặc nhấn nút Đặt Lịch để gửi yêu cầu nhé!'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(message);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const resetChat = () => {
    const newSessionId = `session-${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('techcare_chat_session_id', newSessionId);
    setSessionId(newSessionId);
    setHistory([
      {
        role: 'assistant',
        content: 'Đã khởi tạo phiên chat mới. Mình có thể giúp gì cho bạn hôm nay?'
      }
    ]);
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-[9999] flex flex-col items-end sm:inset-x-auto sm:right-5 sm:bottom-5">
      {isOpen && (
        <div className="mb-3 flex h-[430px] max-h-[calc(100vh-180px)] w-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl transition-all duration-300 origin-bottom-right sm:h-[460px] sm:w-[380px] sm:max-w-[calc(100vw-2rem)]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center space-x-2.5">
              <div className="rounded-xl bg-white/20 p-1.5">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold leading-none sm:text-base">Trợ lý TechCare</h3>
                <span className="mt-1 flex items-center text-[10px] font-semibold text-blue-100">
                  <span className="mr-1.5 h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Hỗ trợ trực tuyến 24/7
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={resetChat}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
                title="Tạo hội thoại mới"
                type="button"
              >
                <RefreshCw className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 transition-colors hover:bg-white/20"
                type="button"
                aria-label="Đóng chatbot"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          {/* Book CTA Banner */}
          <div className="flex items-center justify-between gap-2 border-b border-blue-100 bg-blue-50 px-4 py-2 text-xs">
            <span className="font-bold text-blue-800">Đặt lịch nhanh:</span>
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-1 rounded-lg bg-blue-600 px-3 py-1 font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Đặt lịch ngay</span>
            </Link>
          </div>

          {/* Message Area */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-gray-50/50 p-4">
            {history.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`flex max-w-[85%] items-start space-x-2 ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 rounded-lg p-1.5 text-white ${
                      msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-700'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>

                  <div
                    className={`whitespace-pre-line rounded-2xl border p-3 text-xs leading-relaxed shadow-sm sm:text-sm ${
                      msg.role === 'user'
                        ? 'rounded-tr-none border-blue-600 bg-blue-600 text-white'
                        : 'rounded-tl-none border-gray-200 bg-white text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-start space-x-2">
                  <div className="rounded-lg bg-gray-700 p-1.5 text-white">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="flex items-center space-x-1 rounded-2xl rounded-tl-none border border-gray-200 bg-white p-3 shadow-sm">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap border-t border-gray-100 bg-white px-3 py-2">
            {quickSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="flex-shrink-0 cursor-pointer rounded-full border border-gray-200 bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-700 transition-all hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                type="button"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="flex items-center space-x-2 border-t border-gray-200 bg-white p-3">
            <input
              type="text"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn tư vấn..."
              className="flex-grow rounded-xl border border-gray-200 px-4 py-2.5 text-xs text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="rounded-xl bg-blue-600 p-2.5 text-white shadow-md shadow-blue-100 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Gửi tin nhắn"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full border-2 border-white bg-blue-600 p-4 text-white shadow-2xl transition-all hover:scale-105 hover:bg-blue-700 hover:shadow-blue-300"
        aria-label="Mở khung tư vấn"
        type="button"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 animate-pulse" />}
      </button>
    </div>
  );
}