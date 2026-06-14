import api from './api';

export interface Contact {
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  status?: string;
  isOnline: boolean;
  lastSeen?: string;
}

export const getContacts = async (): Promise<Contact[]> => {
  const { data } = await api.get('/contacts');
  return data;
};

export const addContact = async (contactId: string): Promise<Contact> => {
  const { data } = await api.post(`/contacts/${contactId}`);
  return data;
};

export const removeContact = async (contactId: string): Promise<void> => {
  await api.delete(`/contacts/${contactId}`);
};

export const searchUsers = async (query: string): Promise<Contact[]> => {
  const { data } = await api.get(`/contacts/search?q=${query}`);
  return data;
};
