import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const deleteAccountQuery = async (password) => {
  return await api.post('api/v1/profile/deleteaccount', { json: { password } }).json();
};

export const useDeleteAccount = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (userPassword) => deleteAccountQuery(userPassword),
  });
