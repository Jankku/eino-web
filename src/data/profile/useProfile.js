import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const getProfileQuery = async () => {
  return await api.get('api/v2/profile').json();
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfileQuery,
    useErrorBoundary: (_, query) => {
      return query.state.data !== undefined ? false : true;
    },
  });
};
