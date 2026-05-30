import {
    useInfiniteQuery,
    useMutation,
    useQuery,
    useQueryClient,
  } from '@tanstack/react-query';
  import * as notificationsApi from '@/lib/notifications.api';
  
  export const useNotifications = () => {
    return useInfiniteQuery({
      queryKey: ['notifications'],
      queryFn: ({ pageParam }) =>
        notificationsApi.getNotifications(pageParam as string),
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });
  };
  
  export const useUnreadCount = () => {
    return useQuery({
      queryKey: ['notifications', 'unread-count'],
      queryFn: notificationsApi.getUnreadCount,
      refetchInterval: 30000,
    });
  };
  
  export const useMarkAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: notificationsApi.markAsRead,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };
  
  export const useMarkAllAsRead = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: notificationsApi.markAllAsRead,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };
  
  export const useDeleteNotification = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: notificationsApi.deleteNotification,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      },
    });
  };
  