import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';
import { bulletinSchema } from '../../models/bulletin';
import { z } from 'zod';

export const updateBulletinSchema = bulletinSchema.extend({ id: z.string() });

export type UpdateBulletin = z.infer<typeof updateBulletinSchema>;

const updateBulletinQuery = async (bulletin: UpdateBulletin) => {
  const res = await api
    .put(`api/v2/admin/bulletins/${bulletin.id}`, { json: bulletin })
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useUpdateBulletin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBulletinQuery,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['all_bulletins'] }),
  });
};
