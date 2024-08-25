import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { Credentials } from './auth.schema';

const loginConfigQuery = async (credentials: Omit<Credentials, 'password'>) => {
  return await api
    .post('api/v2/auth/login/config', { json: credentials })
    .json<{ requireOtp: boolean }>();
};

export const useLoginConfig = () =>
  useMutation({
    throwOnError: false,
    mutationFn: loginConfigQuery,
  });
