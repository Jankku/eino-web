import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const deleteAccountQuery = async (password) => {
  const res = await api.post('api/v1/profile/deleteaccount', { json: { password } }).json();
  return res;
};

export const useDeleteAccount = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (userPassword) => deleteAccountQuery(userPassword),
  });
