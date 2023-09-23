import { useMutation } from '@tanstack/react-query';
import axios from '../axios';

const loginUserQuery = async (credentials) => {
  const res = await axios({
    method: 'post',
    url: '/v1/auth/login',
    data: credentials,
  });
  return res.data;
};

export const useLoginUser = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (credentials) => loginUserQuery(credentials),
  });
