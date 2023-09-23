import { useQuery } from '@tanstack/react-query';
import axios from '../axios';

export const getProfileQuery = async () => {
  const res = await axios({
    method: 'GET',
    url: '/v1/profile',
  });
  return res.data;
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
