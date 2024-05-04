import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const verifyEmailQuery = async (otp) => {
  const res = await api.post('api/v2/email/verify', { json: otp }).json();
  return res.results[0];
};

export const useVerifyEmail = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (otp) => verifyEmailQuery(otp),
  });
