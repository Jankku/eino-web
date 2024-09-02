import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

export type UpdateEmailBody = { email: string | null; twoFactorCode: string | null };

const updateEmailQuery = async (body: UpdateEmailBody) => {
  return await api.post('api/v2/email/update', { json: body }).json<ApiResponse<Result>>();
};

export const useUpdateEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: updateEmailQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
