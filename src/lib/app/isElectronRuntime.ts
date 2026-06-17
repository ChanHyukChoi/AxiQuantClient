/**
 * preload가 주입한 Electron 브릿지 존재 여부.
 * Cursor 등 Electron 기반 IDE 내장 브라우저는 UA에 "Electron"이 있어도 electronAPI가 없음.
 */
export const isElectronRuntime = (): boolean =>
  typeof window.electronAPI?.window?.minimize === 'function'
