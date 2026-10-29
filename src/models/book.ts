import { DateTime } from 'luxon';
import { z } from 'zod';

export const bookSchema = z.object({
  isbn: z.string().min(0).max(255).trim().default(''),
  title: z.string().min(0).max(255).trim().default(''),
  author: z.string().min(0).max(255).trim().default(''),
  publisher: z.string().min(0).max(255).trim().default(''),
  image_url: z.union([z.url().trim().nullable().default(null), z.literal('')]),
  pages: z.coerce.number().nonnegative().default(0),
  year: z.coerce.number().nonnegative().default(DateTime.now().year),
  status: z.enum(['reading', 'completed', 'on-hold', 'dropped', 'planned']),
  score: z.coerce.number().nonnegative().max(10).default(0),
  note: z.string().nullish().default(''),
  language_code: z
    .string()
    .nullish()
    .default(null)
    .transform((v) => (typeof v === 'string' && v?.length === 0 ? null : v)),
  start_date: z.string(),
  end_date: z.string(),
});

export const bookWithIdSchema = bookSchema.extend({
  book_id: z.uuid(),
  created_on: z.string(),
});

export type Book = z.infer<typeof bookSchema>;
export type BookLookup = Pick<
  Book,
  'isbn' | 'title' | 'author' | 'publisher' | 'pages' | 'year' | 'language_code'
> & {
  image_url?: Book['image_url'];
};
export type BookWithId = z.infer<typeof bookWithIdSchema>;

export const getNewBookValues = (
  book: Book,
  dirtyFields: Partial<Record<keyof Book, boolean>>,
): Book => {
  const now = DateTime.now();
  const time = {
    hour: now.hour,
    minute: now.minute,
    second: now.second,
    millisecond: now.millisecond,
  };
  return {
    ...book,
    start_date: dirtyFields.start_date
      ? DateTime.fromISO(book.start_date).set(time).toISO()!
      : now.toISO(),
    end_date: dirtyFields.end_date
      ? DateTime.fromISO(book.end_date).set(time).toISO()!
      : now.toISO(),
  };
};

export const getBookDefaults = (initialValues?: Partial<Book>) => {
  return bookSchema.parse({
    isbn: '',
    title: '',
    author: '',
    publisher: '',
    image_url: '',
    pages: 0,
    year: DateTime.now().year,
    status: JSON.parse(localStorage.getItem('newBookStatus')!) || 'planned',
    score: 0,
    note: '',
    language_code: '',
    start_date: DateTime.now().toISO(),
    end_date: DateTime.now().toISO(),
    ...initialValues,
  });
};
