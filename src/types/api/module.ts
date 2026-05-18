export interface ModuleInfo {
  moduleType: string
  connectedAt: string
  /** UI 표시용 (서버 `moduleType` 기반) */
  id: string
  name: string
  type: string
  status: string
  version?: string
  description?: string
}
