import { useQuery } from '@tanstack/react-query';
import axios from '../axios';

const getShareImageQuery = async (shareId) => {
  const res = await axios({
    method: 'GET',
    url: `/share/${shareId}`,
    responseType: 'blob',
    headers: { 'Content-Type': 'image/png' },
  });
  return res.data;
};

export const useShareImage = (visible, shareId, onSuccess) => {
  return useQuery({
    suspense: false,
    enabled: visible && shareId !== undefined,
    queryKey: ['shareImage', shareId],
    queryFn: () => getShareImageQuery(shareId),
    staleTime: 0,
    refetchOnWindowFocus: false,
    onSuccess,
  });
};
