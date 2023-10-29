import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const loginUserQuery = async (credentials) => {
  return await api.post('api/v1/auth/login', { json: credentials }).json();
};

export const useLoginUser = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (credentials) => loginUserQuery(credentials),
  });
