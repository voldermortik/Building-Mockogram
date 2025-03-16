import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { env } from '@/config/env';

// This will throw an error if env variables are missing or invalid
console.log('Environment validated:', {
  mockstoreUrl: env.VITE_MOCKSTORE_API_URL,
  mockagramUrl: env.VITE_MOCKAGRAM_API_URL,
  mockstoreFileLocation: env.VITE_MOCKSTORE_FILE_LOCATION
});

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Failed to find root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
