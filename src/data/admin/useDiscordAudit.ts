import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '../api';

const responseSchema = z.object({
  results: z.tuple([
    z.object({
      enabled: z.boolean(),
      actions: z.array(z.string()),
      available_actions: z.array(z.string()),
      webhook_configured: z.boolean(),
      pending_count: z.number().int().nonnegative(),
      last_success_on: z.iso.datetime({ offset: true }).nullable(),
      last_error: z.string().nullable(),
    }),
  ]),
});

export type DiscordAuditStatus = z.infer<typeof responseSchema>['results'][0];
export type DiscordAuditSettings = Pick<DiscordAuditStatus, 'enabled' | 'actions'>;

const queryKey = ['discord_audit'] as const;
const endpoint = 'api/v2/admin/integrations/discord';

export const useDiscordAudit = () =>
  useQuery({
    queryKey,
    queryFn: async ({ signal }) => {
      const response = await api.get(endpoint, { signal }).json();
      return responseSchema.parse(response).results[0];
    },
  });

export const useUpdateDiscordAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Partial<DiscordAuditSettings>) => {
      // An older status request must not overwrite the confirmed PATCH response.
      await queryClient.cancelQueries({ queryKey });
      const response = await api.patch(endpoint, { json: settings, retry: 0 }).json();
      return responseSchema.parse(response).results[0];
    },
    onSuccess: (status) => queryClient.setQueryData(queryKey, status),
  });
};
