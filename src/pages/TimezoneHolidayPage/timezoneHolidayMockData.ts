import type { HolidayInfo } from '@/types/api/holiday'
import type { TimezoneInfo } from '@/types/api/timezone'

export const MOCK_TIMEZONES: TimezoneInfo[] = [
  {
    id: 1,
    name: 'Always',
    intervals: [{ idx: 0, dmask: 127, hmask: 0, stm: '00:00', etm: '23:59' }],
    startTime: '00:00',
    endTime: '23:59',
    daysOfWeek: 127,
  },
  {
    id: 2,
    name: 'Weekday',
    intervals: [{ idx: 0, dmask: 62, hmask: 0, stm: '09:00', etm: '18:00' }],
    startTime: '09:00',
    endTime: '18:00',
    daysOfWeek: 62,
  },
  {
    id: 3,
    name: 'Night',
    intervals: [{ idx: 0, dmask: 127, hmask: 0, stm: '22:00', etm: '06:00' }],
    startTime: '22:00',
    endTime: '06:00',
    daysOfWeek: 127,
  },
  {
    id: 4,
    name: '업무시간',
    intervals: [{ idx: 0, dmask: 62, hmask: 0, stm: '08:30', etm: '17:30' }],
    startTime: '08:30',
    endTime: '17:30',
    daysOfWeek: 62,
  },
]

export const MOCK_HOLIDAYS: HolidayInfo[] = [
  { id: 1, name: '신정', date: '01-01', isRecurring: true },
  { id: 2, name: '설날', date: '2026-02-16', isRecurring: false },
  { id: 3, name: '삼일절', date: '03-01', isRecurring: true },
  { id: 4, name: '어린이날', date: '05-05', isRecurring: true },
  { id: 5, name: '현충일', date: '06-06', isRecurring: true },
  { id: 6, name: '광복절', date: '08-15', isRecurring: true },
  { id: 7, name: '개천절', date: '10-03', isRecurring: true },
  { id: 8, name: '한글날', date: '10-09', isRecurring: true },
  { id: 9, name: '크리스마스', date: '12-25', isRecurring: true },
]
