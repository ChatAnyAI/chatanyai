/// <reference types="vite/client" />


interface ImportMetaEnv {
  VITE_RENDERER_INTEGRATED_MODEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    mermaid: any
  }
}
