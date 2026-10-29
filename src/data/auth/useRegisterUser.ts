import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { RegisterRequest } from './auth.schema';
import { ApiResponse, Result } from '../types';

const registerUserQuery = async (credentials: RegisterRequest) => {
  return await api
    .post('api/v2/auth/register', { json: credentials })
    .json<ApiResponse<Result[]>>();
};

export const useRegisterUser = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (credentials: RegisterRequest) => registerUserQuery(credentials),
  });
