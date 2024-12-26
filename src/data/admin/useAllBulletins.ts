import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { DbBulletin } from '../../models/bulletin';

const allBulletinsQuery = async () => {
  const res = await api.get('api/v2/admin/bulletins').json<ApiResponse<DbBulletin[]>>();
  return res.results;
};

export const useAllBulletins = () => {
  return useSuspenseQuery({
    queryKey: ['all_bulletins'],
    queryFn: allBulletinsQuery,
  });
};
