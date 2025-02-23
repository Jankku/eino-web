import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

export type ResetPasswordBody = {
  email: string;
  newPassword: string;
  otp: string;
  twoFactorCode?: string | null;
};

const resetPasswordQuery = async (body: ResetPasswordBody) => {
  const res = await api
    .post('api/v2/auth/password/reset', { json: body })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useResetPassword = () =>
  useMutation({
    throwOnError: false,
    mutationFn: resetPasswordQuery,
  });
