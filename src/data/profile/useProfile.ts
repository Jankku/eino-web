import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../api';
import { Profile } from './profile.types';

export const getProfileQuery = async () => {
  return await api.get('api/v2/profile').json<Profile>();
};

export const useProfile = () => {
  return useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: getProfileQuery,
  });
};
