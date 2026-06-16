import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as mediaApi from '@/lib/media.api';

export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({
      file,
      messageId,
    }: {
      file: File;
      messageId?: string;
    }) => mediaApi.uploadFile(file, messageId),
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mediaApi.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
