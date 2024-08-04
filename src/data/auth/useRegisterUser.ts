import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { Credentials } from './auth.schema';

const registerUserQuery = async (credentials: Credentials) => {
  return await api.post('api/v1/auth/register', { json: credentials }).json();
};

export const useRegisterUser = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (credentials: Credentials) => registerUserQuery(credentials),
  });
