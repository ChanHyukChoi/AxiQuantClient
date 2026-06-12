export {}

declare global {
  interface Window {
    electronAPI?: {
      window: {
        minimize: () => void
        maximize: () => void
        close: () => void
        isMaximized: () => Promise<boolean>
        onMaximizedChange: (callback: (maximized: boolean) => void) => () => void
      }
      system?: {
        getMemoryUsageMb: () => Promise<number>
      }
    }
  }
}
