/// <reference types="vite/client" />

interface ImportMetaEnv {
  NODE_ENV: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
