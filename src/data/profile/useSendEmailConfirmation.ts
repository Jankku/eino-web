import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const updateEmailQuery = async () => {
  return await api.post('api/v2/email/sendconfirmation').json<ApiResponse<Result>>();
};

export const useSendEmailConfirmation = () => {
  return useMutation({
    throwOnError: false,
    mutationFn: updateEmailQuery,
  });
};
