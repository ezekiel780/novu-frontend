import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query';
  import * as messagesApi from '@/lib/messages.api';
  import { Message } from '@/types';
  
  export const useMessages = (conversationId: string) => {
    return useInfiniteQuery({
      queryKey: ['messages', conversationId],
      queryFn: ({ pageParam }) =>
        messagesApi.getMessages(conversationId, pageParam as string),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      enabled: !!conversationId,
    });
  };
  
  export const useEditMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, content }: { id: string; content: string }) =>
        messagesApi.editMessage(id, content),
      onSuccess: (updated) => {
        queryClient.setQueriesData(
          { queryKey: ['messages', updated.conversationId] },
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                messages: page.messages.map((m: Message) =>
                  m.id === updated.id ? updated : m,
                ),
              })),
            };
          },
        );
      },
    });
  };
  
  export const useDeleteMessage = (conversationId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: messagesApi.deleteMessage,
      onSuccess: (_, id) => {
        queryClient.setQueriesData(
          { queryKey: ['messages', conversationId] },
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page: any) => ({
                ...page,
                messages: page.messages.filter(
                  (m: Message) => m.id !== id,
                ),
              })),
            };
          },
        );
      },
    });
  };
  