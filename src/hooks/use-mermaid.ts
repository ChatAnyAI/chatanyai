import { loadScript } from '@/lib/utils'

// Extend Window interface to include mermaid
declare global {
  interface Window {
    mermaid: any;
  }
}

let loadedMermaid: Promise<unknown> | null = null;
export const useMermaid = () => {
  const mermaid = loadedMermaid || new Promise((resolve) => {
    loadScript('/static/mermaid.min.js').then(() => {
      window.mermaid.initialize({
        startOnLoad: false,
      })
      resolve(window.mermaid);
    })
  })

  loadedMermaid = mermaid;
  
  return mermaid;
}
