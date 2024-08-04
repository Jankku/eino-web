import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const deleteAccountQuery = async (password: string) => {
  return await api
    .post('api/v1/profile/deleteaccount', { json: { password } })
    .json<ApiResponse<Result>>();
};

export const useDeleteAccount = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (password: string) => deleteAccountQuery(password),
  });
