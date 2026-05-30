'use client';

import { Notification } from '@/types';
import { formatLastSeen, cn } from '@/lib/utils';
import { Trash2, MessageSquare, Phone, Users, Bell } from 'lucide-react';

interface Props {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const icons = {
  NEW_MESSAGE: MessageSquare,
  NEW_CALL: Phone,
  GROUP_INVITE: Users,
  MENTION: Bell,
  SYSTEM: Bell,
};

const colors = {
  NEW_MESSAGE: 'text-green-400 bg-green-400/10',
  NEW_CALL: 'text-blue-400 bg-blue-400/10',
  GROUP_INVITE: 'text-purple-400 bg-purple-400/10',
  MENTION: 'text-yellow-400 bg-yellow-400/10',
  SYSTEM: 'text-gray-400 bg-gray-400/10',
};

export default function NotificationItem({
  notification,
  onRead,
  onDelete,
}: Props) {
  const Icon = icons[notification.type] ?? Bell;
  const colorClass = colors[notification.type] ?? colors.SYSTEM;

  return (
    <div
      onClick={() => !notification.isRead && onRead(notification.id)}
      className={cn(
        'flex items-start gap-4 p-4 rounded-xl border transition cursor-pointer group',
        notification.isRead
          ? 'bg-gray-900 border-gray-800'
          : 'bg-gray-900 border-green-600/20 bg-green-600/5',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          colorClass,
        )}
      >
        <Icon size={18} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-sm font-medium',
              notification.isRead ? 'text-gray-300' : 'text-white',
            )}
          >
            {notification.title}
          </p>
          <div className="flex items-center gap-2 shrink-0">
            {!notification.isRead && (
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-0.5 truncate">
          {notification.body}
        </p>
        <p className="text-gray-600 text-xs mt-1">
          {formatLastSeen(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}
