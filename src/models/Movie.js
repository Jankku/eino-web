import { DateTime } from 'luxon';
import { z } from 'zod';

const Movie = z.object({
  title: z.string().min(0).max(255).trim().default(''),
  studio: z.string().min(0).max(255).trim().default(''),
  director: z.string().min(0).max(255).trim().default(''),
  writer: z.string().min(0).max(255).trim().default(''),
  image_url: z.union([
    z.string().url().trim().startsWith('https').nullable().default(null),
    z.literal(''),
  ]),
  duration: z.coerce.number().nonnegative().default(0),
  year: z.coerce.number().nonnegative().default(DateTime.now().year),
  status: z.enum(['watching', 'completed', 'on-hold', 'dropped', 'planned']),
  score: z.coerce.number().nonnegative().max(10).default(0),
  start_date: z.string(),
  end_date: z.string(),
});

export default Movie;
