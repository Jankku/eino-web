import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

const shareProfileQuery = async () => {
  const res = await api.get('api/v1/profile/share').json();
  return res.results[0].share_id;
};

export const useShareprofile = (visible) =>
  useQuery({
    suspense: false,
    enabled: visible,
    queryKey: ['shareProfile'],
    queryFn: shareProfileQuery,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
