import { DateTime } from 'luxon';
import { z } from 'zod';

export const movieSchema = z.object({
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
  note: z.string().nullish().default(''),
  start_date: z.string(),
  end_date: z.string(),
});

export const movieWithIdSchema = movieSchema.extend({
  movie_id: z.string().uuid(),
});

export type Movie = z.infer<typeof movieSchema>;

export type MovieWithId = z.infer<typeof movieWithIdSchema>;

export const getMovieDefaults = () => {
  return movieSchema.parse({
    title: '',
    studio: '',
    director: '',
    writer: '',
    image_url: '',
    duration: 0,
    year: DateTime.now().year,
    status: JSON.parse(localStorage.getItem('newMovieStatus')!) || 'planned',
    score: 0,
    note: '',
    start_date: DateTime.now().toISO(),
    end_date: DateTime.now().toISO(),
  });
};
