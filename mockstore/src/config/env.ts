import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { cleanEnv, num, str, makeValidator } from 'envalid';

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

const positiveNum = makeValidator((value) => {
  const num = parseInt(value, 10);
  if (isNaN(num) || num <= 0) {
    throw new Error('must be a positive number');
  }
  return num;
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

const env = cleanEnv(process.env, {
  APP_PORT: num(),
  API_URL: apiPath(),
  MONGODB_PORT: num(),
  CLIENT_URL: url(),
  INTERNAL_FILE_DIR_NAME: str(),
  EXTERNAL_FILE_DIR_NAME: str(),
  MAX_IMAGE_SIZE: positiveNum()
});

// Restructure to match the previous format
export const envStructured = {
  APP_PORT: env.APP_PORT,
  API_URL: env.API_URL,
  MONGODB_PORT: env.MONGODB_PORT,
  CLIENT_URL: env.CLIENT_URL,
  INTERNAL_FILE_DIR_NAME: env.INTERNAL_FILE_DIR_NAME,
  EXTERNAL_FILE_DIR_NAME: env.EXTERNAL_FILE_DIR_NAME,
  MAX_IMAGE_UPLOAD_FILE_SIZE: env.MAX_IMAGE_SIZE
} as const;

// Export as env to maintain the same interface
export { envStructured as env }; 
