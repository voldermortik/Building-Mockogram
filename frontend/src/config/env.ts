import { str, cleanEnv } from 'envalid';

export const env = cleanEnv(import.meta.env, {
  VITE_MOCKSTORE_API_URL: str(),
  VITE_MOCKAGRAM_API_URL: str(),
  VITE_MOCKSTORE_FILE_LOCATION: str()
}); 
