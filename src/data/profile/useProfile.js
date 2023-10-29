import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../api';

export const getProfileQuery = async () => {
  return await api.get('api/v2/profile').json();
};

export const useProfile = () => {
  return useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: getProfileQuery,
  });
};
