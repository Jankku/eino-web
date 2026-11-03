import { useSuspenseQuery } from '@tanstack/react-query';
import { PageParams } from '../types';
import { getPage } from '../pagination';

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

export const securityEventsFilter = 'security_events';
export const securityEventsAuditUrl = `/admin/audits?${securityEventsFilter}=true`;

export const useAuditLog = (params: PageParams, securityEventsOnly: boolean) => {
  return useSuspenseQuery({
    queryKey: ['audits', 'page', params, securityEventsOnly],
    queryFn: () =>
      getPage<Audit>(
        'api/v2/admin/audits',
        params,
        securityEventsOnly ? { [securityEventsFilter]: 'true' } : undefined,
      ),
  });
};
