import { useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';

export type ShareTheme = 'light' | 'dark';

const shareProfileQuery = async (theme: ShareTheme, signal: AbortSignal) => {
  const res = await api
    .get('api/v2/profile/share', { searchParams: { theme }, signal })
    .json<ApiResponse<{ share_id: string }[]>>();
  return res.results[0].share_id;
};

export const useShareprofile = (visible: boolean, theme: ShareTheme) =>
  useQuery({
    enabled: visible,
    queryKey: ['shareProfile', theme],
    queryFn: ({ signal }) => shareProfileQuery(theme, signal),
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
