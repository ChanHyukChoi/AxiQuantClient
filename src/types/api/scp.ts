export interface ScpInfo {
  id: number
  name: string
  active: number
  connstr: string
  model: number
  ctype: number
  ext: string
}

export type CreateScpRequest = Omit<ScpInfo, 'id'>
export type UpdateScpRequest = Omit<ScpInfo, 'id'>
