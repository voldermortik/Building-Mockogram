import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { cleanEnv, num, makeValidator } from 'envalid';
import ms, { StringValue } from 'ms';

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, '../..');

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: join(rootDir, envFile) });

// Custom validators
const url = makeValidator((value) => {
  try {
    new URL(value);
    return value;
  } catch {
    throw new Error('must be a valid URL');
  }
});

const jwtSecret = makeValidator((value) => {
  if (value.length < 32) {
    throw new Error('must be at least 32 characters long');
  }
  return value;
});

const duration = makeValidator((value) => {
  try {
    const milliseconds = ms(value as StringValue);
    if (!milliseconds || milliseconds <= 0) {
      throw new Error('Invalid duration');
    }
    return milliseconds;
  } catch {
    throw new Error('must be a valid time duration (e.g., "1d", "2h", "5m", "30s")');
  }
});

const apiPath = makeValidator<string>((value) => {
  if (!value.startsWith('/')) {
    throw new Error('Path must start with a forward slash');
  }
  if (value.endsWith('/')) {
    throw new Error('Path must not end with a forward slash');
  }
  return value;
});

export const env = cleanEnv(process.env, {
  APP_PORT: num(),
  API_URL: apiPath(),
  CLIENT_URL: url(),
  JWT_SECRET: jwtSecret(),
  JWT_EXPIRATION: duration(),
  MONGODB_PORT: num(),
  ARGON2_MEMORY_COST: num(),
  ARGON2_TIME_COST: num(),
  ARGON2_PARALLELISM: num()
});
