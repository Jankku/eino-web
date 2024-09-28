import { useSuspenseQuery } from '@tanstack/react-query';
import { ApiResponse } from '../types';
import { api } from '../api';

export type Audit = {
  id: number;
  username: string;
  action: string;
  table_name?: string;
  record_id?: string;
  old_data?: Record<string, unknown>;
  new_data?: Record<string, unknown>;
  created_on: string;
};

const auditLogQuery = async () => {
  const res = await api.get('api/v2/admin/audits').json<ApiResponse<Audit[]>>();
  return res.results;
};

export const useAuditLog = () => {
  return useSuspenseQuery({
    queryKey: ['audits'],
    queryFn: auditLogQuery,
  });
};
