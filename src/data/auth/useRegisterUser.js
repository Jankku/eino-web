import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const registerUserQuery = async (credentials) => {
  return await api.post('api/v1/auth/register', { json: credentials }).json();
};

export const useRegisterUser = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (credentials) => registerUserQuery(credentials),
  });
