import { TimezoneHolidayShell } from '@/pages/TimezoneHolidayPage/TimezoneHolidayShell'
import { HolidayTabB } from '@/pages/TimezoneHolidayPage/tabs/HolidayTabB'
import { TimezoneTabB } from '@/pages/TimezoneHolidayPage/tabs/TimezoneTabB'

export const TimezoneHolidayPageB = () => (
  <TimezoneHolidayShell
    timezoneTab={<TimezoneTabB />}
    holidayTab={<HolidayTabB />}
    variantPaths={{ a: '/timezone-holiday', b: '/timezone-holiday-b' }}
  />
)
