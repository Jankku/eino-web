import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse, Result } from '../types';

const revokeUserSessionsQuery = async (id: string) => {
  const res = await api
    .post(`api/v2/admin/users/${id}/sessions/revoke`)
    .json<ApiResponse<Result[]>>();
  return res.results[0].message;
};

export const useRevokeUserSessions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    throwOnError: false,
    mutationFn: revokeUserSessionsQuery,
    // If the admin revoked their own sessions, this refetch fails with "Token revoked"
    // and the API client logs them out.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
