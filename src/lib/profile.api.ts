import api from './api';
import { User } from '@/types';

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data;
};

export const updateMe = async (dto: {
  displayName?: string;
  bio?: string;
  status?: string;
  phoneNumber?: string;
  fcmToken?: string;
}): Promise<User> => {
  const { data } = await api.patch('/users/me', dto);
  return data;
};

export const uploadAvatar = async (file: File): Promise<{ fileUrl: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const { data } = await api.get(`/users/search?q=${query}`);
  return data;
};

export const deleteAccount = async (): Promise<void> => {
  await api.delete('/users/me');
};
