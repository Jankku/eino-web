import { useQuery } from '@tanstack/react-query';
import { getBooksQuery } from './useBooksSuspense';

type UseBooksProps = {
  status: string;
  enabled: boolean;
  filter?: string | null;
};

export const useBooks = ({ enabled, status, filter }: UseBooksProps) => {
  return useQuery({
    enabled,
    queryKey: ['books', 'full', status, 'title', 'ascending', filter || ''],
    queryFn: () => getBooksQuery({ status, filter }),
  });
};
