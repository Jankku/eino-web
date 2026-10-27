import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const deleteProfilePictureQuery = async () => {
  const res = await api.delete('api/v2/profile/profilepicture').json<ApiResponse<Result[]>>();
  return res.results[0];
};

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: deleteProfilePictureQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
