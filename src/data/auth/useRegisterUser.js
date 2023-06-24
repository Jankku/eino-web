import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

const registerUserQuery = async (credentials) => {
  const res = await axios({
    method: 'post',
    url: '/auth/register',
    data: credentials,
  });
  return res.data;
};

export const useRegisterUser = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (credentials) => registerUserQuery(credentials),
  });
