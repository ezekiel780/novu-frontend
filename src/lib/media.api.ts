import api from './api';
import { Media } from '@/types';

export const uploadFile = async (
  file: File,
  messageId?: string,
): Promise<Media> => {
  const formData = new FormData();
  formData.append('file', file);
  if (messageId) formData.append('messageId', messageId);

  const { data } = await api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const getMediaByMessage = async (
  messageId: string,
): Promise<Media[]> => {
  const { data } = await api.get(`/media/message/${messageId}`);
  return data;
};

export const getMyMedia = async (): Promise<Media[]> => {
  const { data } = await api.get('/media/me');
  return data;
};

export const deleteMedia = async (id: string): Promise<void> => {
  await api.delete(`/media/${id}`);
};
