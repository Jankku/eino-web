import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';
import { Bulletin } from '../../models/bulletin';

type CreateBulletin = Bulletin & { visibleToUserIds?: string[] };

const createBulletinQuery = async (body: CreateBulletin) => {
  const res = await api
    .post('api/v2/admin/bulletins', { json: body })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useCreateBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBulletinQuery,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all_bulletins'] }),
  });
};
