import { HTTPError } from 'ky';
import { z } from 'zod';

export const zodFields = {
  username: z
    .string({
      required_error: 'Username is required',
    })
    .trim()
    .min(3, 'Username should be at least 3 characters long')
    .max(255, 'Username should be at most 255 characters long'),
  email: z
    .string()
    .trim()
    .email('Invalid email')
    .max(255, { message: 'Email should be at most 255 characters long' }),
  optionalEmail: z
    .string()
    .trim()
    .min(0)
    .max(255, { message: 'Email should be at most 255 characters long' })
    .nullable(),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password should be at least 8 characters long')
    .max(255, 'Password should be at most 255 characters long'),
  otp: z
    .string({ required_error: 'OTP is required' })
    .trim()
    .min(6, 'OTP should be 6 digits long')
    .max(6, 'OTP should be 6 digits long'),
  optionalOtp: z
    .string()
    .trim()
    .min(0)
    .max(6, { message: 'OTP should be 6 digits long' })
    .nullable(),
  optionalDate: z.string().datetime({ offset: true }).nullable(),
};

export const errorSchema = z.object({
  errors: z.array(
    z.object({
      name: z.string(),
      message: z.string(),
    }),
  ),
});

export async function parseError(error: HTTPError) {
  const json = await error.response.json();
  const parsedErrors = errorSchema.parse(json);
  return parsedErrors.errors;
}
