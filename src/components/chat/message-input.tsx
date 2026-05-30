'use client';

import { useState, useRef, KeyboardEvent } from 'react';
import { Send, Paperclip, X, Smile } from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  onSend: (content: string, replyToId?: string) => void;
  replyTo?: Message | null;
  onCancelReply?: () => void;
  disabled?: boolean;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export default function MessageInput({
  onSend,
  replyTo,
  onCancelReply,
  disabled,
  onTyping,
  onStopTyping,
}: Props) {
  const [content, setContent] = useState('');
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (!content.trim() || disabled) return;
    onSend(content.trim(), replyTo?.id);
    setContent('');
    onStopTyping?.();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (value: string) => {
    setContent(value);
    onTyping?.();

    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      onStopTyping?.();
    }, 2000);
  };

  return (
    <div className="border-t border-gray-800 bg-gray-900 p-4">

      {/* Reply Preview */}
      {replyTo && (
        <div className="flex items-start gap-2 bg-gray-800 rounded-xl p-3 mb-3">
          <div className="flex-1 border-l-2 border-green-500 pl-2">
            <p className="text-green-400 text-xs font-medium">
              Replying to {replyTo.sender?.displayName}
            </p>
            <p className="text-gray-300 text-xs truncate mt-0.5">
              {replyTo.content}
            </p>
          </div>
          <button
            onClick={onCancelReply}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-3">
        {/* Attachment */}
        <button className="text-gray-400 hover:text-white transition pb-2.5 shrink-0">
          <Paperclip size={20} />
        </button>

        {/* Textarea */}
        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2.5 focus-within:border-green-500 transition">
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows={1}
            disabled={disabled}
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-sm leading-relaxed max-h-32"
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!content.trim() || disabled}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition shrink-0',
            content.trim()
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed',
          )}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
