export interface TimezoneInterval {
  idx: number
  dmask: number
  hmask: number
  stm: string
  etm: string
}

export interface TimezoneInfo {
  id: number
  name: string
  intervals: TimezoneInterval[]
  /** UI·레거시 — 첫 interval 또는 서버 alias */
  startTime?: string
  endTime?: string
  daysOfWeek?: number
}

export type CreateTimezoneRequest = Omit<TimezoneInfo, 'id'>
export type UpdateTimezoneRequest = Omit<TimezoneInfo, 'id'>
