import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

const passwordStrengthQuery = async (password) => {
  const res = await api.post('api/v1/auth/passwordstrength', { json: { password } }).json();
  return res.results[0];
};

export const usePasswordStrength = (password) =>
  useQuery({
    enabled: !!password,
    queryKey: ['passwordstrength', password],
    queryFn: () => passwordStrengthQuery(password),
    suspense: false,
    gcTime: 0,
    placeholderData: (previousData) => previousData,
  });
