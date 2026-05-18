export interface SioInfo {
  scp: number
  id: number
  name: string
  active: number
  port: number
  addr: number
  model: number
  ext: string
}

export type CreateSioRequest = Omit<SioInfo, 'id' | 'scp'>
export type UpdateSioRequest = Omit<SioInfo, 'id' | 'scp'>
