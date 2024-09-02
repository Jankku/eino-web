import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

type ForgotPasswordResponse = Result & { is2FAEnabled: boolean };

const forgotPasswordQuery = async (email: string) => {
  const res = await api
    .post('api/v2/auth/password/forgot', { json: { email } })
    .json<ApiResponse<ForgotPasswordResponse[]>>();
  return res.results[0];
};

export const useForgotPassword = () =>
  useMutation({
    throwOnError: false,
    mutationFn: forgotPasswordQuery,
  });
