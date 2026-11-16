import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { setAccessToken, setRefreshToken } from '../../utils/tokenStorage';
import { ApiResponse, ResultWithTokens } from '../types';

const disable2FAQuery = async (twoFactorCode: string) => {
  const res = await api
    .post('api/v2/auth/2fa/disable', { json: { twoFactorCode } })
    .json<ApiResponse<ResultWithTokens[]>>();
  // The backend revokes all earlier tokens, so continue the session with the returned ones.
  const { message, accessToken, refreshToken } = res.results[0];
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  return message;
};

export const useDisable2FA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (twoFactorCode: string) => disable2FAQuery(twoFactorCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['bulletins'] });
    },
  });
};
