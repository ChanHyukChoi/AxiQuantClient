export interface AccLvInfo {
  id: number
  name: string
  description?: string
}

export type CreateAccLvRequest = Omit<AccLvInfo, 'id'>
export type UpdateAccLvRequest = Omit<AccLvInfo, 'id'>

/** WPF 스펙: `alv`, `scp`, `rdr`, `tz` — 구 필드명(accLvId 등)은 GET 정규화에서 흡수 */
export interface AccLvRdrInfo {
  alv: number
  scp: number
  rdr: number
  tz?: number
  readerName?: string
  scpName?: string
}

export interface AddAccLvReaderRequest {
  scpId: number
  readerId: number
  tz?: number
}
