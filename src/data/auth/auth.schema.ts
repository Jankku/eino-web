import { z } from 'zod';
import { zodFields } from '../../utils/zodUtil';

export const credentialsSchema = z.object({
  username: zodFields.username,
  password: zodFields.password,
});

export type LoginConfigRequest = z.infer<typeof credentialsSchema>;

export type Credentials = LoginConfigRequest & {
  twoFactorCode?: string;
};

export const registerSchema = credentialsSchema
  .extend({
    email: zodFields.optionalEmail.optional(),
    password2: zodFields.password,
  })
  .superRefine(({ password, password2 }, ctx) => {
    if (password !== password2) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords do not match',
        path: ['password2'],
      });
    }
  });

export type RegisterRequest = z.infer<typeof registerSchema>;
