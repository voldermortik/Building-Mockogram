/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MOCKSTORE_API_URL: string
  readonly VITE_MOCKAGRAM_API_URL: string
  readonly VITE_MOCKSTORE_FILE_LOCATION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
