import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

const shareProfileQuery = async () => {
  const res = await api.get('api/v1/profile/share').json<ApiResponse<{ share_id: string }[]>>();
  return res.results[0].share_id;
};

export const useShareprofile = (visible: boolean) =>
  useQuery({
    enabled: visible,
    queryKey: ['shareProfile'],
    queryFn: shareProfileQuery,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
