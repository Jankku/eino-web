import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const logoutAllQuery = async () => {
  const res = await api.post('api/v2/auth/logout/all').json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useLogoutAll = () =>
  useMutation({
    throwOnError: false,
    mutationFn: logoutAllQuery,
  });
