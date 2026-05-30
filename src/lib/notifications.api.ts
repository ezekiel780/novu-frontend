import api from './api';
import { Notification } from '@/types';

export const getNotifications = async (
  cursor?: string,
): Promise<{ notifications: Notification[]; nextCursor: string | null }> => {
  const params = cursor ? `?cursor=${cursor}` : '';
  const { data } = await api.get(`/notifications${params}`);
  return data;
};

export const getUnreadCount = async (): Promise<{ count: number }> => {
  const { data } = await api.get('/notifications/unread-count');
  return data;
};

export const markAsRead = async (id: string): Promise<void> => {
  await api.patch(`/notifications/${id}/read`);
};

export const markAllAsRead = async (): Promise<void> => {
  await api.patch('/notifications/read-all');
};

export const deleteNotification = async (id: string): Promise<void> => {
  await api.delete(`/notifications/${id}`);
};
