import { useQuery } from '@tanstack/react-query';
import { getBooksQuery } from './useBooksSuspense';

type Props = {
  status: string;
  enabled: boolean;
  filter?: string | null;
};

export const useBooks = ({ enabled, status, filter }: Props) => {
  return useQuery({
    enabled,
    queryKey: ['books', status, filter],
    queryFn: () => getBooksQuery({ status, filter }),
  });
};
