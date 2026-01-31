'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { ThemeToggle } from '@/components/ThemeToggle';

interface ChatListItem {
  _id: string;
  participants: {
    user?: { _id: string; name: string; profileImage?: string };
    barber?: { _id: string; name: string; shopName?: string; profileImage?: string };
  };
  lastMessage?: { content: string; createdAt: string };
  updatedAt: string;
}

interface Message {
  _id?: string;
  sender: string;
  senderType: 'user' | 'barber' | 'admin';
  content: string;
  messageType: string;
  read: boolean;
  createdAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barberIdFromQuery = searchParams.get('barberId');
  const { user, isAuthenticated } = useAuthStore();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const barberIdHandled = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/chat');
      return;
    }
    fetchChats();
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated || !barberIdFromQuery || barberIdHandled.current || loadingChats) return;
    barberIdHandled.current = true;
    api
      .get('/chat', { params: { barberId: barberIdFromQuery } })
      .then((res) => {
        if (!res.data.success || !res.data.data?.chat) return;
        const created = res.data.data.chat;
        return api.get('/chat/user/chats').then((listRes: { data: { success: boolean; data?: { chats?: ChatListItem[] } } }) => {
          if (listRes.data.success && listRes.data.data?.chats) {
            const list = listRes.data.data.chats;
            setChats(list);
            const found = list.find((c) => c._id === created._id);
            setSelectedChat(found || created);
          } else setSelectedChat(created);
        });
      })
      .then(() => window.history.replaceState({}, '', '/chat'))
      .catch(() => toast.error('Could not open chat'))
      .finally(() => { barberIdHandled.current = false; });
  }, [isAuthenticated, barberIdFromQuery, loadingChats]);

  useEffect(() => {
    if (!selectedChat?._id) {
      setMessages([]);
      return;
    }
    setLoadingMessages(true);
    api
      .get(`/chat/${selectedChat._id}/messages`)
      .then((res) => {
        if (res.data.success && res.data.data?.chat?.messages) {
          setMessages(res.data.data.chat.messages);
        } else setMessages([]);
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [selectedChat?._id]);

  const fetchChats = async () => {
    try {
      const res = await api.get('/chat/user/chats');
      if (res.data.success) setChats(res.data.data?.chats || []);
      else setChats([]);
    } catch {
      setChats([]);
    } finally {
      setLoadingChats(false);
    }
  };

  const sendMessage = async () => {
    const content = input.trim();
    if (!content || !selectedChat?._id || sending) return;
    setSending(true);
    try {
      await api.post('/chat/message', { chatId: selectedChat._id, content });
      setInput('');
      const newMsg: Message = {
        sender: user?.id ?? '',
        senderType: 'user',
        content,
        messageType: 'text',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMsg]);
      fetchChats();
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const otherParty = selectedChat?.participants?.barber;

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95 backdrop-blur">
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-forest dark:text-gold-light">BarberApp</Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-[var(--text-secondary)] hover:underline">Dashboard</Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col max-w-4xl">
        <h1 className="text-xl font-bold text-[var(--text-primary)] mb-4">Messages</h1>
        <div className="flex-1 flex flex-col sm:flex-row gap-4 min-h-0 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] overflow-hidden">
          <aside className="w-full sm:w-72 border-b sm:border-b-0 sm:border-r border-[var(--border)] flex flex-col">
            {loadingChats ? (
              <div className="p-4 text-sm text-[var(--text-muted)]">Loading chats...</div>
            ) : chats.length === 0 ? (
              <div className="p-4 text-sm text-[var(--text-muted)]">No conversations yet. Book a barber to start chatting.</div>
            ) : (
              <ul className="overflow-y-auto flex-1">
                {chats.map((chat) => {
                  const barber = chat.participants?.barber;
                  const isSelected = selectedChat?._id === chat._id;
                  return (
                    <li key={chat._id}>
                      <button
                        type="button"
                        onClick={() => setSelectedChat(chat)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[var(--bg-tertiary)] ${
                          isSelected ? 'bg-forest/10 dark:bg-gold/10 border-l-2 border-forest dark:border-gold' : ''
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-forest/10 dark:bg-gold/10 flex items-center justify-center text-forest dark:text-gold font-semibold shrink-0">
                          {barber?.name?.charAt(0) ?? '?'}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[var(--text-primary)] truncate">{barber?.name ?? 'Barber'}</p>
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {chat.lastMessage?.content ?? 'No messages yet'}
                          </p>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>

          <main className="flex-1 flex flex-col min-h-[300px]">
            {!selectedChat ? (
              <div className="flex-1 flex items-center justify-center text-[var(--text-muted)] text-sm p-4">
                Select a conversation or book a barber to start chatting.
              </div>
            ) : (
              <>
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest/10 dark:bg-gold/10 flex items-center justify-center text-forest dark:text-gold font-semibold">
                    {otherParty?.name?.charAt(0) ?? '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{otherParty?.name ?? 'Barber'}</p>
                    {otherParty?.shopName && (
                      <p className="text-xs text-[var(--text-muted)]">{otherParty.shopName}</p>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMessages ? (
                    <p className="text-sm text-[var(--text-muted)]">Loading messages...</p>
                  ) : messages.length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)]">No messages yet. Say hello!</p>
                  ) : (
                    messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-xl px-4 py-2 ${
                            msg.senderType === 'user'
                              ? 'bg-forest dark:bg-gold text-white'
                              : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-[var(--border)] flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)]"
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="px-5 py-3 bg-forest dark:bg-gold text-white font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? '...' : 'Send'}
                  </button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
