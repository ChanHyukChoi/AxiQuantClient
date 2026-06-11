import { useState, type ReactNode } from 'react'
import { Bell, Mail, Star } from 'lucide-react'
import { Tab, type TabItem } from '@/components/primitive/Tab'
import { PageHeader } from '@/layouts/PageHeader'
import { AlarmMailTab } from '@/pages/AlarmSettingsPage/tabs/AlarmMailTab'

export type AlarmSettingsTab = 'rules' | 'priority' | 'mail'

const PAGE_TABS: TabItem[] = [
  { key: 'rules', label: '경보 설정', icon: <Bell size={12} /> },
  { key: 'priority', label: '우선순위', icon: <Star size={12} /> },
  { key: 'mail', label: '이메일 경보', icon: <Mail size={12} /> },
]

interface AlarmSettingsShellProps {
  rulesTab: ReactNode
  priorityTab: ReactNode
  variantPaths: { a: string; b: string }
  title?: string
}

export const AlarmSettingsShell = ({
  rulesTab,
  priorityTab,
  variantPaths,
  title = '경보 설정',
}: AlarmSettingsShellProps) => {
  const [activeTab, setActiveTab] = useState<AlarmSettingsTab>('rules')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={title}
        icon={<Bell size={15} />}
        variantPaths={variantPaths}
      />

      <div className="flex-shrink-0 px-3 pt-2">
        <Tab
          items={PAGE_TABS}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as AlarmSettingsTab)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {activeTab === 'rules' && rulesTab}
        {activeTab === 'priority' && priorityTab}
        {activeTab === 'mail' && <AlarmMailTab />}
      </div>
    </div>
  )
}
