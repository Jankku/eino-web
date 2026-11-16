import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { setAccessToken, setRefreshToken } from '../../utils/tokenStorage';
import { ApiResponse, ResultWithTokens } from '../types';

const enable2FAQuery = async (twoFactorCode: string) => {
  const res = await api
    .post('api/v2/auth/2fa/enable', { json: { twoFactorCode } })
    .json<ApiResponse<ResultWithTokens[]>>();
  // The backend revokes all earlier tokens, so continue the session with the returned ones.
  const { message, accessToken, refreshToken } = res.results[0];
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  return message;
};

export const useEnable2FA = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (twoFactorCode: string) => enable2FAQuery(twoFactorCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['bulletins'] });
    },
  });
};
