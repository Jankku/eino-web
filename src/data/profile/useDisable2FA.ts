import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const disable2FAQuery = async (twoFactorCode: string) => {
  const res = await api
    .post('api/v2/auth/2fa/disable', { json: { twoFactorCode } })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useDisable2FA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (twoFactorCode: string) => disable2FAQuery(twoFactorCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
