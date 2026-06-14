'use client';

import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useDeleteNotification,
} from '@/hooks/useNotifications';
import NotificationItem from '@/components/notifications/notification-item';
import { Bell, CheckCheck, Loader2 } from 'lucide-react';

export default function NotificationsPage() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useNotifications();

  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const notifications =
    data?.pages.flatMap((page: any) => page.notifications) ?? [];

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="h-full flex flex-col bg-gray-950">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-white" />
          <h1 className="text-white font-semibold text-lg">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead()}
            disabled={isMarkingAll}
            className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm font-medium transition"
          >
            {isMarkingAll ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <CheckCheck size={16} />
            )}
            Mark all as read
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">

        {isLoading && (
          <div className="flex items-center justify-center h-32">
            <Loader2 size={24} className="animate-spin text-gray-400" />
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={36} className="text-gray-600" />
            </div>
            <p className="text-gray-400 font-medium">No notifications yet</p>
            <p className="text-gray-500 text-sm mt-1">
              You are all caught up!
            </p>
          </div>
        )}

        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={markAsRead}
            onDelete={deleteNotification}
          />
        ))}

        {/* Load More */}
        {hasNextPage && (
          <div className="flex justify-center pt-2">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="text-green-400 hover:text-green-300 text-sm flex items-center gap-2"
            >
              {isFetchingNextPage && (
                <Loader2 size={14} className="animate-spin" />
              )}
              Load more
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
