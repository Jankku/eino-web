import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { Bulletin } from '../admin/useAllBulletins';

export type ShownBulletin = Pick<Bulletin, 'id' | 'title' | 'message' | 'name' | 'type'>;

const publicBulletinQuery = async () => {
  const res = await api.get('api/v2/bulletins/public').json<ApiResponse<ShownBulletin[]>>();
  return res.results;
};

const userBulletinQuery = async () => {
  const res = await api.get('api/v2/bulletins/user').json<ApiResponse<ShownBulletin[]>>();
  return res.results;
};

export const useBulletins = ({ loggedIn }: { loggedIn: boolean }) => {
  return useQuery({
    queryKey: ['bulletins', { loggedIn }],
    queryFn: () => (loggedIn ? userBulletinQuery() : publicBulletinQuery()),
    staleTime: Infinity,
  });
};
