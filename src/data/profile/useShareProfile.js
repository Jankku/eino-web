import { useQuery } from '@tanstack/react-query';
import axios from '../axios';

const shareProfileQuery = async () => {
  const res = await axios({
    method: 'GET',
    url: '/v1/profile/share',
  });
  return res.data.results[0].share_id;
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
