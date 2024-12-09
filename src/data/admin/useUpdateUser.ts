import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';
import { zodFields } from '../../utils/zodUtil';
import { z } from 'zod';

export const updateUserSchema = z.object({
  user_id: z.string().uuid(),
  username: zodFields.username,
  email: zodFields.optionalEmail,
  email_verified_on: zodFields.optionalDate,
  role_id: z.number().int().positive(),
  profile_picture_path: z.string().nullable(),
  totp_enabled_on: zodFields.optionalDate,
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

const updateUserQuery = async (user: UpdateUser) => {
  const res = await api
    .put(`api/v2/admin/users/${user.user_id}`, { json: user })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: updateUserQuery,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
