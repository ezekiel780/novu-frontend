import api from './api';
import { User } from '@/types';

export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data;
};

export const updateMe = async (dto: Partial<User>): Promise<User> => {
  const { data } = await api.patch('/users/me', dto);
  return data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  const { data } = await api.get(`/users/search?q=${query}`);
  return data;
};

export const getUserById = async (id: string): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};
