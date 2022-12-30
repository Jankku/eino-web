import { DateTime } from 'luxon';
import { z } from 'zod';

const Book = z.object({
  isbn: z.string().min(0).max(255).default(''),
  title: z.string().min(0).max(255).default(''),
  author: z.string().min(0).max(255).default(''),
  publisher: z.string().min(0).max(255).default(''),
  pages: z.coerce.number().nonnegative().default(0),
  year: z.coerce.number().nonnegative().default(DateTime.now().year),
  status: z.enum(['reading', 'completed', 'on-hold', 'dropped', 'planned']),
  score: z.coerce.number().nonnegative().max(10).default(0),
  start_date: z.string(),
  end_date: z.string(),
});

export default Book;
