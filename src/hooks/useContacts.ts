import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contactsApi from '@/lib/contacts.api';

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: contactsApi.getContacts,
  });
};

export const useSearchUsers = (query: string) => {
  return useQuery({
    queryKey: ['users-search', query],
    queryFn: () => contactsApi.searchUsers(query),
    enabled: query.length > 0,
  });
};

export const useAddContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactsApi.addContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useRemoveContact = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: contactsApi.removeContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
