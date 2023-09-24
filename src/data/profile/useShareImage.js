import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

const getShareImageQuery = async (shareId) => {
  return await api.get(`api/v1/share/${shareId}`, {
    headers: { 'Content-Type': 'image/png' },
  });
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
