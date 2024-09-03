import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const enable2FAQuery = async (twoFactorCode: string) => {
  const res = await api
    .post('api/v2/auth/2fa/enable', { json: { twoFactorCode } })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useEnable2FA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (twoFactorCode: string) => enable2FAQuery(twoFactorCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
