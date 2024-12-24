import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

export type Bulletin = {
  id: string;
  title: string;
  message: string | null;
  name: string | null;
  type: 'success' | 'info' | 'warning' | 'error';
  visiblity: 'public' | 'user' | 'condition';
  condition: string | null;
  start_date: string;
  end_date: string;
  created_on: string;
};

const allBulletinsQuery = async () => {
  const res = await api.get('api/v2/admin/bulletins').json<ApiResponse<Bulletin[]>>();
  return res.results;
};

export const useAllBulletins = () => {
  return useQuery({
    queryKey: ['all_bulletins'],
    queryFn: allBulletinsQuery,
  });
};
