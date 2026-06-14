import api from './api';
import { Call } from '@/types';

export const getCalls = async (
  cursor?: string,
): Promise<{ calls: Call[]; nextCursor: string | null }> => {
  const params = cursor ? `?cursor=${cursor}` : '';
  const { data } = await api.get(`/calls/history${params}`);
  return data;
};

export const getMissedCalls = async (): Promise<Call[]> => {
  const { data } = await api.get('/calls/missed');
  return data;
};

export const initiateCall = async (dto: {
  receiverId: string;
  type: 'VOICE' | 'VIDEO';
}): Promise<Call> => {
  const { data } = await api.post('/calls', dto);
  return data;
};

export const updateCallStatus = async (
  id: string,
  status: 'COMPLETED' | 'MISSED' | 'DECLINED',
): Promise<Call> => {
  const { data } = await api.patch(`/calls/${id}`, { status });
  return data;
};
