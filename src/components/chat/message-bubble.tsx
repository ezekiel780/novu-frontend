'use client';

import { Message } from '@/types';
import { useAuthStore } from '@/store/auth.store';
import { format } from 'date-fns';
import { Check, CheckCheck, Trash2, Pencil, FileText, Music, Download } from 'lucide-react';
import Avatar from '@/components/shared/avatar';
import { cn, formatFileSize } from '@/lib/utils';
import FilePreview from './file-preview';

interface Props {
  message: Message;
  onEdit?: (message: Message) => void;
  onDelete?: (id: string) => void;
}

export default function MessageBubble({ message, onEdit, onDelete }: Props) {
  const { user } = useAuthStore();
  const isMe = message.senderId === user?.id;

  const StatusIcon = () => {
    if (!isMe) return null;
    if (message.status === 'READ')
      return <CheckCheck size={14} className="text-green-400" />;
    if (message.status === 'DELIVERED')
      return <CheckCheck size={14} className="text-gray-400" />;
    return <Check size={14} className="text-gray-400" />;
  };

  if (message.deletedAt) {
    return (
      <div className={cn('flex gap-2 group', isMe && 'flex-row-reverse')}>
        <div className="max-w-xs px-4 py-2 rounded-2xl bg-gray-800">
          <p className="text-gray-500 text-sm italic">
            🚫 Message deleted
          </p>
        </div>
      </div>
    );
  }

  const hasMedia = message.media && message.media.length > 0;

  return (
    <div className={cn('flex gap-2 group', isMe && 'flex-row-reverse')}>

      {/* Avatar */}
      {!isMe && (
        <Avatar
          src={message.sender.avatarUrl}
          name={message.sender.displayName}
          size="sm"
          className="mt-auto mb-1"
        />
      )}

      <div
        className={cn(
          'flex flex-col max-w-xs lg:max-w-md',
          isMe && 'items-end',
        )}
      >
        {/* Sender name — group chats */}
        {!isMe && (
          <span className="text-xs text-gray-400 mb-1 ml-1">
            {message.sender.displayName}
          </span>
        )}

        {/* Reply */}
        {message.replyTo && (
          <div
            className={cn(
              'border-l-2 border-green-500 pl-2 mb-1 rounded',
              isMe ? 'bg-green-900/20' : 'bg-gray-800',
              'px-3 py-1.5 max-w-full',
            )}
          >
            <p className="text-green-400 text-xs font-medium">
              {message.replyTo.sender?.displayName ?? 'Unknown'}
            </p>
            <p className="text-gray-300 text-xs truncate">
              {message.replyTo.content}
            </p>
          </div>
        )}

        {/* Media only — no bubble wrapper */}
        {hasMedia && !message.content && (
          <div className="space-y-1 relative group">
            {message.media!.map((m) => (
              <FilePreview key={m.id} media={m} />
            ))}

            {/* Actions on hover */}
            {isMe && (
              <div className="absolute -top-8 right-0 hidden group-hover:flex items-center gap-1 bg-gray-800 rounded-lg p-1 shadow-lg z-10">
                {onDelete && (
                  <button
                    onClick={() => onDelete(message.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Bubble — with or without media */}
        {(message.content || (hasMedia && message.content)) && (
          <div
            className={cn(
              'relative px-4 py-2.5 rounded-2xl',
              isMe
                ? 'bg-green-600 text-white rounded-br-sm'
                : 'bg-gray-800 text-gray-100 rounded-bl-sm',
            )}
          >
            {/* Media inside bubble with caption */}
            {hasMedia && message.content && (
              <div className="mb-2 space-y-1">
                {message.media!.map((m) => (
                  <FilePreview key={m.id} media={m} />
                ))}
              </div>
            )}

            {/* Text */}
            {message.content && (
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {/* Actions on hover */}
            {isMe && (
              <div className="absolute -top-8 right-0 hidden group-hover:flex items-center gap-1 bg-gray-800 rounded-lg p-1 shadow-lg z-10">
                {onEdit && message.messageType === 'TEXT' && (
                  <button
                    onClick={() => onEdit(message)}
                    className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition"
                  >
                    <Pencil size={14} />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(message.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg hover:bg-gray-700 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Time + Status */}
        <div
          className={cn(
            'flex items-center gap-1 mt-1 px-1',
            isMe && 'flex-row-reverse',
          )}
        >
          <span className="text-gray-500 text-xs">
            {format(new Date(message.createdAt), 'HH:mm')}
          </span>
          <StatusIcon />
        </div>
      </div>
    </div>
  );
}
