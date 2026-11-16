import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const importDataQuery = async (data: Blob) => {
  const res = await api
    .post('api/v2/profile/import', { body: data, timeout: 30_000 })
    .json<ApiResponse<Result[]>>();
  return res.results[0];
};

const importedDataQueryKeys = [['books'], ['book'], ['movies'], ['movie'], ['profile']];

export const useImportData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: (data: Blob) => importDataQuery(data),
    onSuccess: () =>
      Promise.all(
        importedDataQueryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })),
      ),
  });
};
