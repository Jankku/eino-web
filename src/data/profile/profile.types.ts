import { BookWithId } from '../../models/book';
import { MovieWithId } from '../../models/movie';
import type { Audit } from '../admin/useAuditLog';

type ItemScoreRow = {
  score: number;
  count: number;
};

type ProfileShare = {
  share_id: string;
  created_on: string;
};

export type Profile = {
  user_id: string;
  email: string | null;
  email_verified_on: string | null;
  username: string;
  registration_date: string;
  totp_enabled_on: string | null;
  last_login_on: string | null;
  profile_picture_path: string | null;
  stats: {
    book: {
      count: Record<string, number>;
      pages_read: number;
      score_average: number;
      score_distribution: ItemScoreRow[];
    };
    movie: {
      count: Record<string, number>;
      watch_time: number;
      score_average: number;
      score_distribution: ItemScoreRow[];
    };
  };
};

export type ProfileExport = {
  version: number;
  profile: Profile;
  books: BookWithId[];
  movies: MovieWithId[];
  shares: ProfileShare[];
  audits: Audit[];
};
