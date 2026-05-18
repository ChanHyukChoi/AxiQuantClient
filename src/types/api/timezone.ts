export interface TimezoneInfo {
  id: number
  name: string
  startTime: string
  endTime: string
  daysOfWeek?: number
}

export type CreateTimezoneRequest = Omit<TimezoneInfo, 'id'>
export type UpdateTimezoneRequest = Omit<TimezoneInfo, 'id'>
