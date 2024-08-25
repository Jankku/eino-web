import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const verifyEmailQuery = async (otp: string) => {
  return await api.post('api/v2/email/verify', { json: { otp } }).json<ApiResponse<Result>>();
};

export const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: verifyEmailQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
