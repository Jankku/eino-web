import { useSuspenseQuery } from '@tanstack/react-query';
import { PageParams } from '../types';
import { getPage } from '../pagination';
import { DbBulletin } from '../../models/bulletin';

export const useAllBulletins = (params: PageParams) => {
  return useSuspenseQuery({
    queryKey: ['all_bulletins', 'page', params],
    queryFn: () => getPage<DbBulletin>('api/v2/admin/bulletins', params),
  });
};
