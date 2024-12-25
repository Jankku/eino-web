import { DateTime, Duration } from 'luxon';
import { z } from 'zod';

export type DbBulletin = {
  id: string;
  title: string;
  message: string | null;
  name: string | null;
  type: 'success' | 'info' | 'warning' | 'error';
  visiblity: 'public' | 'user' | 'condition';
  condition: string | null;
  start_date: string;
  end_date: string;
  created_on: string;
};

export const bulletinTypes = ['success', 'info', 'warning', 'error'] as const;
export const bulletinVisibilities = ['public', 'user', 'condition'] as const;
export const bulletinConditions = ['2fa_not_enabled', 'email_not_verified'] as const;

export const bulletinSchema = z.object({
  title: z.string().min(1),
  message: z.string().nullish(),
  name: z.string().nullish(),
  type: z.enum(bulletinTypes),
  visibility: z.enum(bulletinVisibilities),
  condition: z.string().nullish(),
  start_date: z.string().refine((value) => new Date(value).getTime() >= Date.now(), {
    message: 'Start date must be in the future',
  }),
  end_date: z.string().refine((value) => new Date(value).getTime() >= Date.now(), {
    message: 'End date must be in the future',
  }),
});

export type Bulletin = z.infer<typeof bulletinSchema>;

export const bulletinDefaults: Bulletin = {
  title: '',
  message: '',
  name: '',
  type: 'info',
  visibility: 'public',
  condition: null,
  start_date: DateTime.now()
    .plus(Duration.fromObject({ minutes: 1 }))
    .toISO(),
  end_date: DateTime.now()
    .plus(Duration.fromObject({ minutes: 1 }))
    .toISO(),
};
