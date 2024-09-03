import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

export type DeleteAccountBody = {
  password: string;
  twoFactorCode?: string;
};

const deleteAccountQuery = async (body: DeleteAccountBody) => {
  const res = await api
    .post('api/v1/profile/deleteaccount', { json: body })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useDeleteAccount = () =>
  useMutation({
    throwOnError: false,
    mutationFn: deleteAccountQuery,
  });
