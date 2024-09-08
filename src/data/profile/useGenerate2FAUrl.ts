import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

const generateUrlQuery = async () => {
  const res = await api
    .post('api/v2/auth/2fa/generate')
    .json<ApiResponse<{ totpUrl: string; qrCodeUrl: string }[]>>();
  return res.results[0];
};

export const useGenerate2FAUrl = (visible: boolean) => {
  return useQuery({
    enabled: visible,
    throwOnError: false,
    queryKey: ['2fa', 'generate'],
    queryFn: generateUrlQuery,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
