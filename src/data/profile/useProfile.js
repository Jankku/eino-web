import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export const getProfileQuery = async () => {
  const res = await api.get('api/v1/profile').json();
  return res;
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
