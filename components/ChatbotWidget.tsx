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

  // Scroll to bottom when history updates or widget is opened
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

    // Add user message to history
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
        setHistory((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setHistory((prev) => [
          ...prev, 
          { 
            role: 'assistant', 
            content: 'Dạ xin lỗi anh/chị, hệ thống chatbot đang bảo trì đột xuất. Anh/chị có thể liên hệ trực tiếp Hotline 0898.451.211 để kỹ thuật viên hỗ trợ ngay ạ!' 
          }
        ]);
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
      setHistory((prev) => [
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
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-[340px] sm:w-[380px] h-[500px] sm:h-[550px] rounded-3xl border border-gray-200 shadow-2xl flex flex-col mb-4 overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2.5">
              <div className="bg-white/20 p-1.5 rounded-xl">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-none">Trợ lý TechCare</h3>
                <span className="text-[10px] text-blue-100 font-semibold flex items-center mt-1">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
                  Hỗ trợ trực tuyến 24/7
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button 
                onClick={resetChat} 
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                title="Tạo hội thoại mới"
              >
                <RefreshCw className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="h-4.5 w-4.5 text-white" />
              </button>
            </div>
          </div>

          {/* Book CTA Banner */}
          <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex justify-between items-center text-xs">
            <span className="text-blue-800 font-bold">Đặt lịch nhanh không cần chờ đợi:</span>
            <Link
              href="/booking"
              onClick={() => setIsOpen(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1 rounded-lg flex items-center space-x-1 shadow-sm transition-colors"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Đặt lịch ngay</span>
            </Link>
          </div>

          {/* Message Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {history.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`p-1.5 rounded-lg text-white flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-blue-500' : 'bg-gray-700'
                  }`}>
                    {msg.role === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </div>

                  {/* Bubble Content */}
                  <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm border ${
                    msg.role === 'user'
                      ? 'bg-blue-600 border-blue-600 text-white rounded-tr-none'
                      : 'bg-white border-gray-250 text-gray-800 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>

                </div>
              </div>
            ))}

            {/* Typing Loader */}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="p-1.5 rounded-lg bg-gray-700 text-white">
                    <Bot className="h-3 w-3" />
                  </div>
                  <div className="p-3 bg-white border border-gray-250 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-1">
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Quick Suggestions list */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-200">
            {quickSuggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug)}
                className="bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-100 rounded-full px-3 py-1.5 text-xs font-bold transition-all cursor-pointer flex-shrink-0"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleFormSubmit} className="p-3 border-t border-gray-200 bg-white flex items-center space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tin nhắn tư vấn..."
              className="flex-grow px-4 py-2.5 rounded-xl border border-gray-250 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs sm:text-sm text-gray-800"
            />
            <button
              type="submit"
              disabled={!message.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 sm:p-4.5 rounded-full shadow-2xl hover:shadow-blue-300 hover:scale-105 transition-all flex items-center justify-center border-2 border-white"
        aria-label="Mở khung tư vấn"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6 animate-pulse" />}
      </button>

    </div>
  );
}
