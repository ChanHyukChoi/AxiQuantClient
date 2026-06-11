import { TimezoneHolidayShell } from '@/pages/TimezoneHolidayPage/TimezoneHolidayShell'
import { HolidayTab } from '@/pages/TimezoneHolidayPage/tabs/HolidayTab'
import { TimezoneTab } from '@/pages/TimezoneHolidayPage/tabs/TimezoneTab'

export const TimezoneHolidayPage = () => (
  <TimezoneHolidayShell
    timezoneTab={<TimezoneTab />}
    holidayTab={<HolidayTab />}
    variantPaths={{ a: '/timezone-holiday', b: '/timezone-holiday-b' }}
  />
)
