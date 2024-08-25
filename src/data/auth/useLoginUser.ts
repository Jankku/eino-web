import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { Credentials } from './auth.schema';

const loginUserQuery = async (credentials: Credentials) => {
  return await api
    .post('api/v2/auth/login', { json: credentials })
    .json<{ accessToken: string; refreshToken: string }>();
};

export const useLoginUser = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (credentials: Credentials) => loginUserQuery(credentials),
  });
