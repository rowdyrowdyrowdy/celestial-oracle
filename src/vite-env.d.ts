/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASTRONOMY_API_ID: string
  readonly VITE_ASTRONOMY_API_SECRET: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
