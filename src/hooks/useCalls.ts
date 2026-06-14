import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as callsApi from '@/lib/calls.api';

export const useCalls = () => {
  return useInfiniteQuery({
    queryKey: ['calls'],
    queryFn: ({ pageParam }) =>
      callsApi.getCalls(pageParam as string),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
};

export const useMissedCalls = () => {
  return useQuery({
    queryKey: ['calls', 'missed'],
    queryFn: callsApi.getMissedCalls,
  });
};

export const useInitiateCall = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: callsApi.initiateCall,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
  });
};

export const useUpdateCallStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'COMPLETED' | 'MISSED' | 'DECLINED';
    }) => callsApi.updateCallStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calls'] });
    },
  });
};
