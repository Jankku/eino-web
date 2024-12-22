import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

export type Bulletin = {
  id: string;
  title: string;
  content: string | null;
};

const publicBulletinQuery = async () => {
  const res = await api.get('api/v2/bulletins/public').json<ApiResponse<Bulletin[]>>();
  return res.results;
};

const userBulletinQuery = async () => {
  const res = await api.get('api/v2/bulletins/user').json<ApiResponse<Bulletin[]>>();
  return res.results;
};

export const useBulletins = ({ loggedIn }: { loggedIn: boolean }) => {
  return useQuery({
    queryKey: ['bulletins', { loggedIn }],
    queryFn: () => (loggedIn ? userBulletinQuery() : publicBulletinQuery()),
    staleTime: Infinity,
  });
};
