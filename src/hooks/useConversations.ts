import {
    useQuery,
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query';
  import * as conversationsApi from '@/lib/conversations.api';
  import * as usersApi from '@/lib/users.api';
  
  export const useConversations = () => {
    return useQuery({
      queryKey: ['conversations'],
      queryFn: conversationsApi.getConversations,
    });
  };
  
  export const useConversation = (id: string) => {
    return useQuery({
      queryKey: ['conversations', id],
      queryFn: () => conversationsApi.getConversation(id),
      enabled: !!id,
    });
  };
  
  export const useCreateConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: conversationsApi.createConversation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };
  
  export const useSearchUsers = (query: string) => {
    return useQuery({
      queryKey: ['users', 'search', query],
      queryFn: () => usersApi.searchUsers(query),
      enabled: query.length > 1,
    });
  };
  
  export const useLeaveConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: conversationsApi.leaveConversation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };
  
  export const useDeleteConversation = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: conversationsApi.deleteConversation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      },
    });
  };
  