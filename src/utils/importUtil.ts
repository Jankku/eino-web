import { z } from 'zod';

export const byteFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  style: 'unit',
  unit: 'byte',
  unitDisplay: 'narrow',
});

const stringToJSONSchema = z.string().transform((str, ctx) => {
  try {
    return JSON.parse(str);
  } catch {
    ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
    return z.NEVER;
  }
});

const importFileSchema = z.object({
  version: z.number(),
  profile: z.object({ username: z.string() }),
  books: z.array(z.object({})),
  movies: z.array(z.object({})),
  shares: z.array(z.object({})),
});

const TEN_MB = 10 * 1024 * 1024;

export type FileValidationError = {
  code: string;
  message: string;
};

export const imageValidator = async (file: File): Promise<FileValidationError[]> => {
  if (file.size > TEN_MB) {
    return [
      {
        code: 'file_too_large',
        message: `File size must be less than ${byteFormatter.format(TEN_MB)}`,
      },
    ];
  }

  if (!file.type.startsWith('image/')) {
    return [
      {
        code: 'invalid_file_type',
        message: 'File must be an image',
      },
    ];
  }

  return [];
};

export type ImportPreview = {
  bookCount: number;
  movieCount: number;
  version: number;
  username: string;
};

type ImportFileResult = {
  preview: ImportPreview | null;
  errors: FileValidationError[];
};

export const readEinoImportFile = async (file: File): Promise<ImportFileResult> => {
  if (file.size > TEN_MB) {
    return {
      preview: null,
      errors: [
        {
          code: 'file_too_large',
          message: `File size must be less than ${byteFormatter.format(TEN_MB)}`,
        },
      ],
    };
  }

  let fileText: string;
  try {
    fileText = await file.text();
  } catch {
    return {
      preview: null,
      errors: [
        { code: 'file_read_error', message: 'Could not read file. Please select it again.' },
      ],
    };
  }

  const textJson = stringToJSONSchema.safeParse(fileText);
  if (file.type !== 'application/json' || !textJson.success) {
    return {
      preview: null,
      errors: [{ code: 'invalid_file_type', message: 'File must be a JSON file' }],
    };
  }

  const result = importFileSchema.safeParse(textJson.data);
  if (!result.success) {
    return {
      preview: null,
      errors: [{ code: 'invalid_file_format', message: 'File does not match the expected format' }],
    };
  }

  const { books, movies, version, profile } = result.data;
  return {
    preview: {
      version,
      bookCount: books.length,
      movieCount: movies.length,
      username: profile.username,
    },
    errors: [],
  };
};
