import { z } from 'zod';

export const zodFields = {
  username: z
    .string({
      required_error: 'Username is required',
    })
    .min(3, 'Username should be at least 3 characters long')
    .max(255, 'Username should be at most 255 characters long'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password should be at least 8 characters long')
    .max(255, 'Password should be at most 255 characters long'),
};

export const errorSchema = z.object({
  errors: z.array(
    z.object({
      name: z.string(),
      message: z.string(),
    }),
  ),
});

export async function parseError(error) {
  const json = await error.response.json();
  const parsedErrors = errorSchema.parse(json);
  return parsedErrors.errors;
}
