import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { LoginConfigRequest } from './auth.schema';

const loginConfigQuery = async (credentials: LoginConfigRequest) => {
  return await api
    .post('api/v2/auth/login/config', { json: credentials })
    .json<{ is2FAEnabled: boolean }>();
};

export const useLoginConfig = () =>
  useMutation({
    throwOnError: false,
    mutationFn: loginConfigQuery,
  });
