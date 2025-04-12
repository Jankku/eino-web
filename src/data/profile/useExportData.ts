import { useMutation } from '@tanstack/react-query';
import { api } from '../api';
import { ProfileExport } from './profile.types';

const exportDataQuery = async ({
  password,
  includeAuditLog,
}: {
  password: string;
  includeAuditLog: boolean;
}) => {
  return await api
    .post('api/v1/profile/export', { json: { password, includeAuditLog } })
    .json<ProfileExport>();
};

export const useExportData = () =>
  useMutation({
    throwOnError: false,
    mutationFn: (form: { password: string; includeAuditLog: boolean }) => exportDataQuery(form),
  });
