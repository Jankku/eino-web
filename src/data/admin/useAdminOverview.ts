import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { api } from '../api';
import { ApiResponse } from '../types';
import { DbBulletin } from '../../models/bulletin';
import { Audit } from './useAuditLog';

export type OverviewPeriod = { start_date: string; end_date: string };

export type AdminOverview = {
  generated_on: string;
  period: OverviewPeriod & { timezone: 'UTC' };
  users: { total: number; registered: number };
  books: { total: number; added: number };
  movies: { total: number; added: number };
  security_events: {
    total: number;
    by_action: {
      login_failed: number;
      authentication_failed: number;
      authorization_denied: number;
      two_factor_authentication_failed: number;
      password_reset_failed: number;
      email_verification_failed: number;
    };
  };
  recently_active_users: {
    user_id: string;
    username: string;
    role_id: number;
    role: 'admin' | 'basic' | 'demo';
    profile_picture_path: string | null;
    last_login_on: string;
    book_count: number;
    movie_count: number;
  }[];
  account_security: {
    email_verified: number;
    email_unverified: number;
    two_factor_enabled: number;
    two_factor_disabled: number;
    disabled_accounts: number;
  };
  recent_audit_activity: Omit<Audit, 'old_data' | 'new_data'>[];
  bulletins: {
    active: number;
    scheduled: number;
    items: (DbBulletin & { status: 'active' | 'scheduled' })[];
  };
};

export const useAdminOverview = (period: OverviewPeriod) =>
  useQuery({
    queryKey: ['admin_overview', period],
    placeholderData: keepPreviousData,
    queryFn: async ({ signal }) => {
      const response = await api
        .get('api/v2/admin/overview', { searchParams: period, signal })
        .json<ApiResponse<AdminOverview[]>>();
      if (response.results.length !== 1 || !response.results[0]?.security_events) {
        throw new Error('Invalid overview response');
      }
      return response.results[0];
    },
  });
