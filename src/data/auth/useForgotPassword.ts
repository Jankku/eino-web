import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const forgotPasswordQuery = async (email: string) => {
  const res = await api
    .post('api/v2/auth/password/forgot', { json: { email } })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useForgotPassword = () =>
  useMutation({
    throwOnError: false,
    mutationFn: forgotPasswordQuery,
  });
