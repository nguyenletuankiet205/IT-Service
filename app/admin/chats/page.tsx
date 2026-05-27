'use client';

import React, { useEffect, useState } from 'react';
import LoadingState from '../../../components/LoadingState';
import EmptyState from '../../../components/EmptyState';
import { ChatSession, ChatMessage } from '../../../lib/types';
import { MessageSquare, User } from 'lucide-react';

export default function AdminChatsPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadedSessionId, setLoadedSessionId] = useState<string | null>(null);
  const loadingMessages = !!selectedId && loadedSessionId !== selectedId;

  useEffect(() => {
    fetch('/api/chats', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.length) {
          setSessions(data.data);
          setSelectedId(data.data[0].session_id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingSessions(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    let cancelled = false;
    fetch(`/api/chats?session_id=${encodeURIComponent(selectedId)}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && data.success && data.data) {
          setMessages(data.data);
          setLoadedSessionId(selectedId);
        }
      })
      .catch(err => console.error(err));

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Lịch Sử Chatbot
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Xem các phiên tư vấn và nội dung hội thoại với khách hàng
        </p>
      </div>

      {loadingSessions ? (
        <LoadingState message="Đang tải phiên chat..." />
      ) : sessions.length === 0 ? (
        <EmptyState
          title="Chưa có phiên chat"
          description="Khi khách sử dụng chatbot, lịch sử sẽ hiển thị tại đây."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[480px]">
          <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 text-xs font-bold text-slate-400 uppercase">
              Phiên chat ({sessions.length})
            </div>
            <ul className="divide-y divide-slate-800 max-h-[420px] overflow-y-auto">
              {sessions.map(session => (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(session.session_id)}
                    className={`w-full text-left px-4 py-3 hover:bg-slate-800/50 transition-colors ${
                      selectedId === session.session_id ? 'bg-blue-950/40 border-l-2 border-blue-500' : ''
                    }`}
                  >
                    <p className="font-bold text-sm text-slate-200 truncate">
                      {session.customer_name || 'Khách vãng lai'}
                    </p>
                    {session.interested_service && (
                      <p className="text-xs text-blue-400 mt-0.5">{session.interested_service}</p>
                    )}
                    {session.customer_phone && (
                      <p className="text-xs text-slate-500">{session.customer_phone}</p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center space-x-2">
              <MessageSquare className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-bold text-slate-300">Nội dung hội thoại</span>
            </div>

            <div className="flex-grow p-4 space-y-3 overflow-y-auto max-h-[420px]">
              {loadingMessages ? (
                <LoadingState message="Đang tải tin nhắn..." />
              ) : messages.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">Chưa có tin nhắn trong phiên này</p>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2 rounded-xl text-xs sm:text-sm ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-1 mb-1 opacity-70 text-[10px]">
                        {msg.role === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <MessageSquare className="h-3 w-3" />
                        )}
                        <span>{msg.role === 'user' ? 'Khách' : 'Bot'}</span>
                      </div>
                      <p className="whitespace-pre-line leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
