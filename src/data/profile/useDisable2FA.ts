import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const disable2FAQuery = async (otp: string) => {
  const res = await api
    .post('api/v2/auth/2fa/disable', { json: { otp } })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useDisable2FA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (otp: string) => disable2FAQuery(otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
