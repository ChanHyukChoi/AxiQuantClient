export interface HolidayInfo {
  id: number
  timezoneId: number
  name: string
  date: string
  isRecurring?: boolean
}

export type CreateHolidayRequest = Omit<HolidayInfo, 'id'>
export type UpdateHolidayRequest = Omit<HolidayInfo, 'id'>
