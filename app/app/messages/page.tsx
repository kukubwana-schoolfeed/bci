'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { storageMessages } from '@/lib/storage';
import { Message, MessageReply } from '@/lib/types';
import { generateId } from '@/lib/utils';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Get or create the user's message thread
  const thread = messages.find(m => m.customerId === user?.id) ?? null;

  useEffect(() => {
    setMessages(storageMessages.get());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.replies?.length]);

  function handleSend() {
    if (!input.trim() || !user) return;

    const allMessages = storageMessages.get();
    const idx = allMessages.findIndex(m => m.customerId === user.id);

    const reply: MessageReply = {
      id: generateId(),
      sender: 'customer',
      text: input.trim(),
      time: 'Just now',
    };

    if (idx >= 0) {
      storageMessages.addReply(allMessages[idx].id, reply);
    } else {
      // Create new thread
      const newMsg: Message = {
        id: generateId(),
        customerId: user.id,
        customer: user.name,
        message: input.trim(),
        time: 'Just now',
        read: false,
        platform: 'app',
        replies: [{ id: generateId(), sender: 'customer', text: input.trim(), time: 'Just now' }],
        createdAt: new Date().toISOString(),
      };
      storageMessages.set([newMsg, ...allMessages]);
    }

    setMessages(storageMessages.get());
    setInput('');
  }

  const allReplies: MessageReply[] = [
    ...(thread?.replies ?? []),
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      {/* Header */}
      <div className="bg-[#0D0D0D] px-4 pt-8 pb-4 border-b border-[rgba(201,168,76,0.15)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-[#C9A84C] flex items-center justify-center bg-[rgba(201,168,76,0.1)]">
            <MessageCircle size={18} className="text-[#C9A84C]" />
          </div>
          <div>
            <h1 className="font-headline text-xl">Brian Chanda <em>Innovations</em></h1>
            <p className="font-body text-[10px] text-[#22C55E] tracking-wider">● Typically replies within minutes</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 overflow-y-auto space-y-4">
        {/* Welcome message from BCI */}
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 bg-[#111]">
            <span className="font-body text-[9px] font-bold text-[#C9A84C]">BC</span>
          </div>
          <div className="bg-[#161616] border border-[rgba(201,168,76,0.1)] px-4 py-3 max-w-[80%]">
            <p className="font-body text-sm text-[#F5F0E8]">
              Welcome to Brian Chanda Innovations! How can we help you today? Browse our fashion and tech products or ask us anything.
            </p>
            <p className="font-body text-[9px] text-[#555] mt-1">Support Team</p>
          </div>
        </div>

        {/* Thread messages */}
        {allReplies.map(reply => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${reply.sender === 'customer' ? 'flex-row-reverse' : ''}`}
          >
            {reply.sender === 'admin' && (
              <div className="w-8 h-8 rounded-full border border-[rgba(201,168,76,0.3)] flex items-center justify-center flex-shrink-0 bg-[#111]">
                <span className="font-body text-[9px] font-bold text-[#C9A84C]">BC</span>
              </div>
            )}
            <div
              className={`px-4 py-3 max-w-[80%] ${
                reply.sender === 'customer'
                  ? 'bg-[#C9A84C] text-black'
                  : 'bg-[#161616] border border-[rgba(201,168,76,0.1)]'
              }`}
            >
              <p className="font-body text-sm">{reply.text}</p>
              <p className={`font-body text-[9px] mt-1 ${reply.sender === 'customer' ? 'text-black/60' : 'text-[#555]'}`}>
                {reply.time}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {user ? (
        <div className="border-t border-[rgba(201,168,76,0.15)] bg-[#0D0D0D] px-4 py-3">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="input-gold flex-1 py-3"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 bg-[#C9A84C] text-black flex items-center justify-center disabled:opacity-40 hover:bg-[#E2C675] transition-colors flex-shrink-0"
              style={{ boxShadow: input.trim() ? '0 0 20px rgba(201,168,76,0.3)' : 'none' }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div className="border-t border-[rgba(201,168,76,0.15)] bg-[#0D0D0D] px-4 py-4 text-center">
          <p className="font-body text-sm text-[#888] mb-3">Sign in to send messages</p>
          <a href="/app/account" className="btn-primary inline-flex text-[11px]">SIGN IN</a>
        </div>
      )}
    </div>
  );
}
