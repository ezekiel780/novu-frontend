'use client';

import { useState, useRef, KeyboardEvent, useCallback } from 'react';
import { Send, Paperclip, X, Loader2 } from 'lucide-react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { useUploadFile } from '@/hooks/useMedia';
import UploadPreview from './upload-preview';

interface Props {
  onSend: (content: string, replyToId?: string, mediaId?: string) => void;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const { mutate: uploadFile, isPending: isUploading } = useUploadFile();

  const handleSend = useCallback(() => {
    if ((!content.trim() && !selectedFile) || disabled) return;

    if (selectedFile) {
      uploadFile(
        { file: selectedFile },
        {
          onSuccess: (media) => {
            onSend(content.trim(), replyTo?.id, media.id);
            setContent('');
            setSelectedFile(null);
            onStopTyping?.();
          },
        },
      );
    } else {
      onSend(content.trim(), replyTo?.id);
      setContent('');
      onStopTyping?.();
    }
  }, [content, selectedFile, disabled, replyTo, onSend, onStopTyping, uploadFile]);

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
    typingTimeout.current = setTimeout(() => onStopTyping?.(), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size exceeds 100MB limit');
      return;
    }
    setSelectedFile(file);
    e.target.value = '';
  };

  const canSend = (content.trim() || selectedFile) && !disabled && !isUploading;

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

      {/* File Preview */}
      {selectedFile && (
        <div className="flex items-center gap-3 mb-3 p-2 bg-gray-800 rounded-xl">
          <UploadPreview
            file={selectedFile}
            onRemove={() => setSelectedFile(null)}
            isUploading={isUploading}
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-xs font-medium truncate">
              {selectedFile.name}
            </p>
            <p className="text-gray-400 text-xs">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-3">
        {/* File Attachment */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-gray-400 hover:text-white transition pb-2.5 shrink-0"
        >
          <Paperclip size={20} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
        />

        {/* Textarea */}
        <div className="flex-1 bg-gray-800 border border-gray-700 rounded-2xl px-4 py-2.5 focus-within:border-green-500 transition">
          <textarea
            value={content}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={selectedFile ? 'Add a caption...' : 'Type a message...'}
            rows={1}
            disabled={disabled || isUploading}
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none text-sm leading-relaxed max-h-32"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center transition shrink-0',
            canSend
              ? 'bg-green-600 hover:bg-green-500 text-white'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed',
          )}
        >
          {isUploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>
    </div>
  );
}
