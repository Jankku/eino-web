import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

const exportDataQuery = async (password) => {
  const res = await api.post('api/v1/profile/export', { json: { password } }).json();
  return res;
};

export const useExportData = () =>
  useMutation({
    useErrorBoundary: false,
    mutationFn: (userPassword) => exportDataQuery(userPassword),
  });
