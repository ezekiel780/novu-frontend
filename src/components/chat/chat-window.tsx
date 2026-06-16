'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMessages, useEditMessage, useDeleteMessage } from '@/hooks/useMessages';
import { useConversation } from '@/hooks/useConversations';
import { useSocketContext } from '@/providers/socket.provider';
import { useAuthStore } from '@/store/auth.store';
import { useQueryClient } from '@tanstack/react-query';
import MessageBubble from './message-bubble';
import MessageInput from './message-input';
import ChatHeader from './chat-header';
import { Message } from '@/types';
import { Loader2 } from 'lucide-react';
import * as messagesApi from '@/lib/messages.api';

interface Props {
  conversationId: string;
}

export default function ChatWindow({ conversationId }: Props) {
  const { user } = useAuthStore();
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: conversation } = useConversation(conversationId);
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(conversationId);

  const { mutate: editMessage } = useEditMessage();
  const { mutate: deleteMessage } = useDeleteMessage(conversationId);

  // Flatten pages
  const messages =
    data?.pages.flatMap((page: any) => page.messages).reverse() ?? [];

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Join room and mark as read
  useEffect(() => {
    if (!socket || !conversationId) return;
    socket.emit('conversation:join', conversationId);
    messagesApi.markAsRead(conversationId);
    return () => {
      socket.emit('conversation:leave', conversationId);
    };
  }, [socket, conversationId]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: Message) => {
      queryClient.setQueryData(
        ['messages', conversationId],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page: any, i: number) =>
              i === old.pages.length - 1
                ? { ...page, messages: [...page.messages, message] }
                : page,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      if (message.senderId !== user?.id) {
        messagesApi.markAsRead(conversationId);
        socket.emit('message:read', { conversationId });
      }
    };

    const handleTypingStart = (data: { userId: string }) => {
      if (data.userId === user?.id) return;
      const member = conversation?.members?.find(
        (m) => m.userId === data.userId,
      );
      setTypingUser(member?.user?.displayName ?? 'Someone');
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 3000);
    };

    const handleTypingStop = (data: { userId: string }) => {
      if (data.userId !== user?.id) setIsTyping(false);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing:start', handleTypingStart);
    socket.on('typing:stop', handleTypingStop);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('typing:start', handleTypingStart);
      socket.off('typing:stop', handleTypingStop);
    };
  }, [socket, conversationId, user?.id, conversation]);

  // Send message
  const handleSend = useCallback(
    (content: string, replyToId?: string, mediaId?: string) => {
      if (!socket) return;
      socket.emit('message:send', {
        conversationId,
        content: content || undefined,
        messageType: mediaId ? 'FILE' : 'TEXT',
        replyToId,
        mediaId,
      });
      setReplyTo(null);
    },
    [socket, conversationId],
  );

  // Typing events
  const handleTyping = useCallback(() => {
    socket?.emit('typing:start', { conversationId });
  }, [socket, conversationId]);

  const handleStopTyping = useCallback(() => {
    socket?.emit('typing:stop', { conversationId });
  }, [socket, conversationId]);

  const handleEdit = (message: Message) => {
    setEditingMessage(message);
  };

  const handleDelete = (id: string) => {
    deleteMessage(id);
  };

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">

      {/* Header */}
      <ChatHeader
        conversation={conversation}
        isTyping={isTyping}
        typingUser={typingUser}
      />

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20 md:pb-4">

        {/* Load more */}
        {hasNextPage && (
          <div className="flex justify-center">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-green-400 text-xs hover:text-green-300 flex items-center gap-1"
            >
              {isFetchingNextPage ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                'Load older messages'
              )}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        )}

        {messages.map((message: Message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2">
            <div className="bg-gray-800 rounded-2xl px-4 py-2.5 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
            <span className="text-gray-500 text-xs">{typingUser}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input — add bottom padding for mobile nav */}
      <div className="mb-16 md:mb-0">
        <MessageInput
          onSend={handleSend}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </div>
    </div>
  );
}
