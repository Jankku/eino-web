import { useSuspenseQuery } from '@tanstack/react-query';
import { ApiResponse } from '../types';
import { api } from '../api';

export type User = {
  user_id: string;
  username: string;
  role_id: number;
  role: string;
  email: string | null;
  email_verified_on: string;
  totp_enabled_on: string;
  last_login_on: string;
  created_on: string;
};

const usersQuery = async () => {
  const res = await api.get('api/v2/admin/users').json<ApiResponse<User[]>>();
  return res.results;
};

export const useUsers = () => {
  return useSuspenseQuery({
    queryKey: ['users'],
    queryFn: usersQuery,
  });
};
