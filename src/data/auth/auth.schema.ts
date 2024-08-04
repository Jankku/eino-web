import { z } from 'zod';
import { zodFields } from '../../utils/zodUtil';

export const credentialsSchema = z.object({
  username: zodFields.username,
  password: zodFields.password,
});

export type Credentials = z.infer<typeof credentialsSchema>;
