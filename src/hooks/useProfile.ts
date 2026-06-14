import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as profileApi from '@/lib/profile.api';
import { useAuthStore } from '@/store/auth.store';

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profileApi.getMe,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: profileApi.updateMe,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['profile'], updatedUser);
      updateUser(updatedUser);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: async (data) => {
      const updated = await profileApi.updateMe({ avatarUrl: data.fileUrl } as any);
      queryClient.setQueryData(['profile'], updated);
      updateUser(updated);
    },
  });
};

export const useDeleteAccount = () => {
  const { clearAuth } = useAuthStore();
  return useMutation({
    mutationFn: profileApi.deleteAccount,
    onSuccess: () => {
      clearAuth();
      window.location.href = '/login';
    },
  });
};
