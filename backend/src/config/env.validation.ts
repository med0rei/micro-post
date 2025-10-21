import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().int().positive().default(3000),

  // Database
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive().default(5432),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),

  // Auth
  AUTH_TOKEN_EXPIRES_IN_DAYS: z.coerce.number().int().positive().default(1),
});

export type EnvironmentVariables = z.infer<typeof envSchema>;

export const validate = (config: Record<string, unknown>) => {
  const validated = envSchema.parse(config);
  return validated;
};
