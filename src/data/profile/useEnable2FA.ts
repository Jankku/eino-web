import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const enable2FAQuery = async (otp: string) => {
  const res = await api
    .post('api/v2/auth/2fa/enable', { json: { otp } })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useEnable2FA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (otp: string) => enable2FAQuery(otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
