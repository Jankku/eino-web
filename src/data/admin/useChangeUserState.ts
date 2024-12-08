import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const enableUserQuery = async (id: string) => {
  const res = await api.post(`api/v2/admin/users/${id}/enable`).json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

const disableUserQuery = async (id: string) => {
  const res = await api.post(`api/v2/admin/users/${id}/disable`).json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

const mutationFn = (disabled: boolean) => (id: string) =>
  disabled ? enableUserQuery(id) : disableUserQuery(id);

export const useChangeUserState = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: ({ id, disabled }: { id: string; disabled: boolean }) => {
      return mutationFn(disabled)(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
