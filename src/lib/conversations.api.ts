import api from './api';
import { Conversation } from '@/types';

export const getConversations = async (): Promise<Conversation[]> => {
  const { data } = await api.get('/conversations');
  return data;
};

export const getConversation = async (id: string): Promise<Conversation> => {
  const { data } = await api.get(`/conversations/${id}`);
  return data;
};

export const createConversation = async (dto: {
  type: 'DM' | 'GROUP';
  memberIds: string[];
  name?: string;
  description?: string;
}): Promise<Conversation> => {
  const { data } = await api.post('/conversations', dto);
  return data;
};

export const updateConversation = async (
  id: string,
  dto: { name?: string; description?: string; avatarUrl?: string },
): Promise<Conversation> => {
  const { data } = await api.patch(`/conversations/${id}`, dto);
  return data;
};

export const addMember = async (
  conversationId: string,
  memberId: string,
): Promise<void> => {
  await api.post(`/conversations/${conversationId}/members/${memberId}`);
};

export const removeMember = async (
  conversationId: string,
  memberId: string,
): Promise<void> => {
  await api.delete(`/conversations/${conversationId}/members/${memberId}`);
};

export const leaveConversation = async (id: string): Promise<void> => {
  await api.delete(`/conversations/${id}/leave`);
};

export const deleteConversation = async (id: string): Promise<void> => {
  await api.delete(`/conversations/${id}`);
};
