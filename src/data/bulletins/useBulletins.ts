import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { DbBulletin } from '../../models/bulletin';

export type ShownBulletin = Pick<
  DbBulletin,
  'id' | 'title' | 'message' | 'name' | 'condition' | 'type'
>;

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
