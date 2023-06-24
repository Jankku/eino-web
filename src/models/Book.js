import { DateTime } from 'luxon';
import { z } from 'zod';

const Book = z.object({
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
  start_date: z.string(),
  end_date: z.string(),
});

export const bookDefaults = Book.parse({
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  image_url: '',
  pages: 0,
  year: DateTime.now().year,
  status: 'reading',
  score: 0,
  start_date: DateTime.now().toISO(),
  end_date: DateTime.now().toISO(),
});

export default Book;
