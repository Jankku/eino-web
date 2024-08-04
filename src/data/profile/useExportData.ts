import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ProfileExport } from './profile.types';

const exportDataQuery = async (password: string) => {
  return await api.post('api/v1/profile/export', { json: { password } }).json<ProfileExport>();
};

export const useExportData = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (password: string) => exportDataQuery(password),
  });
