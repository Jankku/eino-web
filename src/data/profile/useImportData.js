import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const importDataQuery = async (data) => {
  return await api.post('api/v2/profile/import', { body: data, timeout: 30_000 }).json();
};

export const useImportData = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (data) => importDataQuery(data),
  });
