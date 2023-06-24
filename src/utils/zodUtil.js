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
