import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

const deleteAccountQuery = async (password) => {
  const res = await axios({
    method: 'POST',
    url: '/v1/profile/deleteaccount',
    data: { password },
  });
  return res.data;
};

export const useDeleteAccount = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (userPassword) => deleteAccountQuery(userPassword),
  });
