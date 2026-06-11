import { useState, type ReactNode } from 'react'
import { Calendar, Clock } from 'lucide-react'
import { Tab, type TabItem } from '@/components/primitive/Tab'
import { PageHeader } from '@/layouts/PageHeader'
import type { PageVariantPaths } from '@/layouts/PageVariantToggle'

export type TimezoneHolidayTab = 'timezone' | 'holiday'

const PAGE_TABS: TabItem[] = [
  { key: 'timezone', label: '타임존', icon: <Clock size={12} /> },
  { key: 'holiday', label: '휴일', icon: <Calendar size={12} /> },
]

interface TimezoneHolidayShellProps {
  timezoneTab: ReactNode
  holidayTab: ReactNode
  variantPaths: PageVariantPaths
}

export const TimezoneHolidayShell = ({
  timezoneTab,
  holidayTab,
  variantPaths,
}: TimezoneHolidayShellProps) => {
  const [activeTab, setActiveTab] = useState<TimezoneHolidayTab>('timezone')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="타임존-휴일"
        icon={<Clock size={15} />}
        variantPaths={variantPaths}
      />

      <div className="flex-shrink-0 px-3 pt-2">
        <Tab
          items={PAGE_TABS}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as TimezoneHolidayTab)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {activeTab === 'timezone' && timezoneTab}
        {activeTab === 'holiday' && holidayTab}
      </div>
    </div>
  )
}
