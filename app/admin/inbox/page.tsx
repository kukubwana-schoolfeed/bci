'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Sparkles, CheckSquare, Square, X } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useRouter } from 'next/navigation';
import { storageMessages } from '@/lib/storage';
import { Message, MessageReply } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { generateSmartReply } from '@/lib/smartReply';

function getSmartReplies(msg: string) { return generateSmartReply(msg); }

type FilterTab = 'all' | 'unread' | 'app' | 'whatsapp';

export default function AdminInboxPage() {
  const { isAdminLoggedIn } = useAdmin();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [smartReplies, setSmartReplies] = useState<string[]>([]);
  const [showSmart, setShowSmart] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkReply, setBulkReply] = useState('');
  const [bulkSent, setBulkSent] = useState(false);

  useEffect(() => {
    if (!isAdminLoggedIn) { router.replace('/admin'); return; }
    setMessages(storageMessages.get());
  }, [isAdminLoggedIn, router]);

  const active = messages.find(m => m.id === activeId);

  const filtered = messages.filter(m => {
    if (filter === 'unread' && m.read) return false;
    if (filter === 'app' && m.platform !== 'app') return false;
    if (filter === 'whatsapp' && m.platform !== 'whatsapp') return false;
    if (search && !m.customer.toLowerCase().includes(search.toLowerCase()) && !m.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function selectMessage(id: string) {
    setActiveId(id);
    storageMessages.markRead(id);
    setMessages(storageMessages.get());
    setShowSmart(false);
    setSmartReplies([]);
    setReplyText('');
  }

  function handleSend() {
    if (!replyText.trim() || !activeId) return;
    const reply: MessageReply = { id: generateId(), sender: 'admin', text: replyText.trim(), time: 'Just now' };
    storageMessages.addReply(activeId, reply);
    setMessages(storageMessages.get());
    setReplyText('');
    setShowSmart(false);
  }

  function handleSmartReply() {
    if (!active) return;
    const suggestions = getSmartReplies(active.message);
    setSmartReplies(suggestions);
    setShowSmart(true);
  }

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function generateBulkReply() {
    const msgs = messages.filter(m => selected.has(m.id)).map(m => m.message);
    const reply = getSmartReplies(msgs[0] ?? '')[0];
    setBulkReply(reply);
  }

  function sendBulkReply() {
    selected.forEach(id => {
      const reply: MessageReply = { id: generateId(), sender: 'admin', text: bulkReply, time: 'Just now' };
      storageMessages.addReply(id, reply);
    });
    setMessages(storageMessages.get());
    setBulkSent(true);
    setTimeout(() => { setBulkSent(false); setBulkMode(false); setSelected(new Set()); setBulkReply(''); }, 3000);
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left panel — message list */}
      <div className="w-80 border-r border-[rgba(201,168,76,0.15)] flex flex-col">
        <div className="px-4 py-4 border-b border-[rgba(201,168,76,0.15)]">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-headline text-2xl">Inbox</h1>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#C9A84C] text-black text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              <button
                onClick={() => { setBulkMode(!bulkMode); setSelected(new Set()); }}
                className={`font-body text-[9px] font-bold tracking-wider uppercase px-2 py-1 border transition-all ${
                  bulkMode ? 'border-[#C9A84C] text-[#C9A84C] bg-[rgba(201,168,76,0.1)]' : 'border-[rgba(255,255,255,0.1)] text-[#555]'
                }`}
              >
                BULK
              </button>
            </div>
          </div>
          <div className="relative mb-3">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-gold pl-8 py-2 text-xs"
            />
          </div>
          <div className="flex gap-1">
            {(['all', 'unread', 'app', 'whatsapp'] as FilterTab[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`font-body text-[8px] font-bold tracking-wider uppercase px-2 py-1 border transition-all flex-1 ${
                  filter === f ? 'bg-[#C9A84C] text-black border-[#C9A84C]' : 'border-[rgba(255,255,255,0.08)] text-[#555]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filtered.map(msg => (
            <div
              key={msg.id}
              onClick={() => bulkMode ? toggleSelect(msg.id) : selectMessage(msg.id)}
              className={`flex items-start gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.04)] cursor-pointer transition-all ${
                activeId === msg.id && !bulkMode ? 'bg-[rgba(201,168,76,0.08)]' : 'hover:bg-[#111]'
              }`}
            >
              {bulkMode && (
                <div className="mt-0.5 flex-shrink-0">
                  {selected.has(msg.id) ? <CheckSquare size={16} className="text-[#C9A84C]" /> : <Square size={16} className="text-[#333]" />}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-body text-xs font-semibold truncate">{msg.customer}</span>
                  <span className="font-body text-[9px] text-[#555] flex-shrink-0">{msg.time}</span>
                </div>
                <p className="font-body text-xs text-[#888] truncate">{msg.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`font-body text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
                    msg.platform === 'whatsapp' ? 'bg-[#25D366]/20 text-[#25D366]' : 'bg-[rgba(201,168,76,0.15)] text-[#C9A84C]'
                  }`}>
                    {msg.platform}
                  </span>
                  {!msg.read && (
                    <span className="w-2 h-2 rounded-full bg-[#C9A84C]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk action bar */}
        {bulkMode && selected.size > 0 && (
          <div className="p-4 border-t border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.05)]">
            <p className="font-body text-xs text-[#C9A84C] mb-2">{selected.size} selected</p>
            {!bulkReply ? (
              <button onClick={generateBulkReply} className="btn-primary w-full justify-center text-[10px] py-2.5">
                <Sparkles size={12} /> GENERATE BULK REPLY
              </button>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={bulkReply}
                  onChange={e => setBulkReply(e.target.value)}
                  rows={3}
                  className="input-gold text-xs resize-none"
                />
                {bulkSent ? (
                  <div className="text-center py-2">
                    <p className="font-body text-xs text-[#22C55E] font-bold">
                      ✓ Replied to {selected.size} customers!
                    </p>
                  </div>
                ) : (
                  <button onClick={sendBulkReply} className="btn-primary w-full justify-center text-[10px] py-2.5">
                    SEND TO ALL {selected.size} →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right panel — conversation */}
      <div className="flex-1 flex flex-col">
        {active ? (
          <>
            {/* Conversation header */}
            <div className="px-6 py-4 border-b border-[rgba(201,168,76,0.15)] flex items-center justify-between">
              <div>
                <h2 className="font-headline text-xl">{active.customer}</h2>
                <span className={`font-body text-[9px] font-bold uppercase tracking-wider ${
                  active.platform === 'whatsapp' ? 'text-[#25D366]' : 'text-[#C9A84C]'
                }`}>
                  {active.platform}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Initial message */}
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[rgba(201,168,76,0.2)] flex items-center justify-center flex-shrink-0">
                  <span className="font-body text-[9px] font-bold text-[#C9A84C]">{active.customer[0]}</span>
                </div>
                <div className="bg-[#161616] border border-[rgba(255,255,255,0.05)] px-4 py-3 max-w-lg">
                  <p className="font-body text-sm">{active.message}</p>
                  <p className="font-body text-[9px] text-[#555] mt-1">{active.time}</p>
                </div>
              </div>

              {/* Replies */}
              {active.replies?.map(reply => (
                <div key={reply.id} className={`flex gap-3 ${reply.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                  {reply.sender === 'customer' && (
                    <div className="w-8 h-8 rounded-full bg-[#1C1C1C] border border-[rgba(201,168,76,0.2)] flex items-center justify-center flex-shrink-0">
                      <span className="font-body text-[9px] font-bold text-[#C9A84C]">{active.customer[0]}</span>
                    </div>
                  )}
                  <div className={`px-4 py-3 max-w-lg ${
                    reply.sender === 'admin'
                      ? 'bg-[#C9A84C] text-black'
                      : 'bg-[#161616] border border-[rgba(255,255,255,0.05)]'
                  }`}>
                    <p className="font-body text-sm">{reply.text}</p>
                    <p className={`font-body text-[9px] mt-1 ${reply.sender === 'admin' ? 'text-black/60' : 'text-[#555]'}`}>
                      {reply.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Reply Suggestions */}
            <AnimatePresence>
              {showSmart && smartReplies.length > 0 && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="px-6 py-3 border-t border-[rgba(201,168,76,0.15)] bg-[#0D0D0D]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-body text-[10px] font-bold tracking-[0.2em] uppercase text-[#C9A84C]">
                      ✨ Smart Suggestions
                    </p>
                    <button onClick={() => setShowSmart(false)} className="text-[#555] hover:text-[#888]">
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    {smartReplies.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setReplyText(s); setShowSmart(false); }}
                        className="text-left p-3 bg-[#161616] border border-[rgba(201,168,76,0.15)] hover:border-[#C9A84C] font-body text-xs text-[#888] hover:text-[#F5F0E8] transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reply input */}
            <div className="px-6 py-4 border-t border-[rgba(201,168,76,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={handleSmartReply}
                  className="flex items-center gap-1.5 font-body text-[9px] font-bold tracking-[0.15em] uppercase px-3 py-2 border border-[rgba(201,168,76,0.3)] text-[#C9A84C] hover:bg-[rgba(201,168,76,0.1)] transition-all"
                >
                  <Sparkles size={12} /> SMART REPLY
                </button>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  className="input-gold flex-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!replyText.trim()}
                  className="btn-primary px-5 disabled:opacity-40"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center">
            <div>
              <p className="font-headline text-2xl text-[#333] mb-2">Select a conversation</p>
              <p className="font-body text-sm text-[#444]">Choose a message from the left panel</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
