import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

type Veryify2FABody = {
  username: string;
  otp: string;
};

const verify2FAQuery = async (body: Veryify2FABody) => {
  const res = await api
    .post('api/v2/auth/2fa/verify', { json: body })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useVerify2FA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: verify2FAQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};
