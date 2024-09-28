import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const deleteUserQuery = async (id: string) => {
  const res = await api.delete(`api/v2/admin/users/${id}`).json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: deleteUserQuery,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
