import { DateTime } from 'luxon';
import { z } from 'zod';

export const bookSchema = z.object({
  isbn: z.string().min(0).max(255).trim().default(''),
  title: z.string().min(0).max(255).trim().default(''),
  author: z.string().min(0).max(255).trim().default(''),
  publisher: z.string().min(0).max(255).trim().default(''),
  image_url: z.union([
    z.string().url().trim().startsWith('https').nullable().default(null),
    z.literal(''),
  ]),
  pages: z.coerce.number().nonnegative().default(0),
  year: z.coerce.number().nonnegative().default(DateTime.now().year),
  status: z.enum(['reading', 'completed', 'on-hold', 'dropped', 'planned']).default('reading'),
  score: z.coerce.number().nonnegative().max(10).default(0),
  note: z.string().nullish().default(''),
  start_date: z.string(),
  end_date: z.string(),
});

export const bookWithIdSchema = bookSchema.extend({
  book_id: z.string().uuid(),
});

export type Book = z.infer<typeof bookSchema>;

export type BookWithId = z.infer<typeof bookWithIdSchema>;

export const bookDefaults = bookSchema.parse({
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  image_url: '',
  pages: 0,
  year: DateTime.now().year,
  status: 'reading',
  score: 0,
  note: '',
  start_date: DateTime.now().toISO(),
  end_date: DateTime.now().toISO(),
});
