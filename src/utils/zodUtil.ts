import { isHTTPError } from 'ky';
import { z } from 'zod';

export const zodFields = {
  username: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Username is required' : 'Invalid username'),
    })
    .trim()
    .min(3, 'Username should be at least 3 characters long')
    .max(255, 'Username should be at most 255 characters long'),
  email: z
    .email('Invalid email')
    .trim()
    .max(255, { message: 'Email should be at most 255 characters long' }),
  optionalEmail: z
    .string()
    .trim()
    .min(0)
    .max(255, { message: 'Email should be at most 255 characters long' })
    .nullable(),
  password: z
    .string({
      error: (issue) => (issue.input === undefined ? 'Password is required' : 'Invalid password'),
    })
    .min(8, 'Password should be at least 8 characters long')
    .max(255, 'Password should be at most 255 characters long'),
  otp: z
    .string({
      error: (issue) => (issue.input === undefined ? 'OTP is required' : 'Invalid OTP'),
    })
    .trim()
    .min(6, 'OTP should be 6 digits long')
    .max(6, 'OTP should be 6 digits long'),
  optionalOtp: z
    .string()
    .trim()
    .min(0)
    .max(6, { message: 'OTP should be 6 digits long' })
    .nullable(),
  optionalDate: z.iso.datetime({ offset: true }).nullable(),
};

export const errorSchema = z.object({
  errors: z.array(
    z.object({
      name: z.string(),
      message: z.string(),
    }),
  ),
});

export type ApiError = z.infer<typeof errorSchema>['errors'][number];

const fallbackError = (message: string): ApiError[] => [{ name: 'unknown_error', message }];

/**
 * Extracts API errors from a request error. Always returns at least one error,
 * falling back to a generic message for network errors, timeouts and unexpected responses.
 */
export async function parseError(error: unknown): Promise<ApiError[]> {
  if (!isHTTPError(error)) {
    return fallbackError('Could not reach the server. Please check your connection and try again.');
  }
  const parsed = errorSchema.safeParse(error.data);
  if (parsed.success && parsed.data.errors.length > 0) return parsed.data.errors;
  return fallbackError('Something went wrong. Please try again.');
}
