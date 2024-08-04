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
  profile: z.object({}),
  books: z.array(z.object({})),
  movies: z.array(z.object({})),
  shares: z.array(z.object({})),
});

const TEN_MB = 10 * 1024 * 1024;

export type FileValidationError = {
  code: string;
  message: string;
};

export const fileValidator = async (file: File): Promise<FileValidationError[]> => {
  if (file.size > TEN_MB) {
    return [
      {
        code: 'file_too_large',
        message: `File size must be less than ${byteFormatter.format(TEN_MB)}`,
      },
    ];
  }

  const fileText = await file.text();
  const textJson = stringToJSONSchema.safeParse(fileText);
  if (file.type !== 'application/json' || !textJson.success) {
    return [
      {
        code: 'invalid_file_type',
        message: 'File must be a JSON file',
      },
    ];
  }

  const { success } = importFileSchema.safeParse(textJson.data);
  if (!success) {
    return [
      {
        code: 'invalid_file_format',
        message: 'File does not match the expected format',
      },
    ];
  }

  return [];
};
