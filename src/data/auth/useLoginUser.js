import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

const loginUserQuery = async (credentials) => {
  const res = await axios({
    method: 'post',
    url: '/auth/login',
    data: credentials,
  });
  return res.data;
};

export const useLoginUser = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (userCredentials) => loginUserQuery(userCredentials),
  });
