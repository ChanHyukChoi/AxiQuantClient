import { useState, type ReactNode } from 'react'
import { Activity, History } from 'lucide-react'
import { Tab, type TabItem } from '@/components/primitive/Tab'
import { PageHeader } from '@/layouts/PageHeader'
import type { PageVariantPaths } from '@/layouts/PageVariantToggle'

export type EventMonitorTab = 'live' | 'history'

const PAGE_TABS: TabItem[] = [
  { key: 'live', label: '실시간', icon: <Activity size={12} /> },
  { key: 'history', label: '이력 조회', icon: <History size={12} /> },
]

interface EventMonitorShellProps {
  liveTab: ReactNode
  historyTab: ReactNode
  variantPaths: PageVariantPaths
}

export const EventMonitorShell = ({
  liveTab,
  historyTab,
  variantPaths,
}: EventMonitorShellProps) => {
  const [activeTab, setActiveTab] = useState<EventMonitorTab>('live')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="이벤트 모니터"
        icon={<Activity size={15} />}
        variantPaths={variantPaths}
      />

      <div className="flex-shrink-0 px-3 pt-2">
        <Tab
          items={PAGE_TABS}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as EventMonitorTab)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {activeTab === 'live' && liveTab}
        {activeTab === 'history' && historyTab}
      </div>
    </div>
  )
}
