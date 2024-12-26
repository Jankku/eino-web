import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const deleteBulletinQuery = async (id: string) => {
  const res = await api.delete(`api/v2/admin/bulletins/${id}`).json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useDeleteBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: deleteBulletinQuery,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all_bulletins'] }),
  });
};
