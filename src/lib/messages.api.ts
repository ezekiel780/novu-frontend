import api from './api';
import { Message } from '@/types';

export const getMessages = async (
  conversationId: string,
  cursor?: string,
): Promise<{ messages: Message[]; nextCursor: string | null }> => {
  const params = cursor ? `?cursor=${cursor}` : '';
  const { data } = await api.get(
    `/messages/${conversationId}${params}`,
  );
  return data;
};

export const sendMessage = async (dto: {
  conversationId: string;
  content?: string;
  messageType?: string;
  replyToId?: string;
}): Promise<Message> => {
  const { data } = await api.post('/messages', dto);
  return data;
};

export const editMessage = async (
  id: string,
  content: string,
): Promise<Message> => {
  const { data } = await api.patch(`/messages/${id}`, { content });
  return data;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/messages/${id}`);
};

export const markAsRead = async (
  conversationId: string,
): Promise<void> => {
  await api.patch(`/messages/${conversationId}/read`);
};
