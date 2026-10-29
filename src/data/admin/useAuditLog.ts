import { useSuspenseQuery } from '@tanstack/react-query';
import { ApiResponse } from '../types';
import { api } from '../api';

export type Audit = {
  id: number;
  username: string | null;
  actor_user_id: string | null;
  action: string;
  table_name: string | null;
  record_id: string | null;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
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
