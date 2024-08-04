import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

const passwordStrengthQuery = async (password: string) => {
  const res = await api
    .post('api/v1/auth/passwordstrength', { json: { password } })
    .json<ApiResponse<{ score: number; message: string }[]>>();
  return res.results[0];
};

export const usePasswordStrength = (password: string) =>
  useQuery({
    enabled: !!password,
    queryKey: ['passwordstrength', password],
    queryFn: () => passwordStrengthQuery(password),
    gcTime: 0,
    placeholderData: (previousData) => previousData,
  });
