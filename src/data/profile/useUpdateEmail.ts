import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const updateEmailQuery = async (email: string | null) => {
  return await api.post('api/v2/email/update', { json: { email } }).json<ApiResponse<Result>>();
};

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (email: string | null) => updateEmailQuery(email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
