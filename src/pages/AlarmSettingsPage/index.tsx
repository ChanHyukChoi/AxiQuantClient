import { useState } from 'react'
import { Bell, Mail, Star } from 'lucide-react'
import { Tab } from '@/components/primitive/Tab'
import type { TabItem } from '@/components/primitive/Tab'
import { AlarmMailTab } from '@/pages/AlarmSettingsPage/tabs/AlarmMailTab'
import { AlarmPriorityTab } from '@/pages/AlarmSettingsPage/tabs/AlarmPriorityTab'
import { AlarmRulesTab } from '@/pages/AlarmSettingsPage/tabs/AlarmRulesTab'

type AlarmSettingsTab = 'rules' | 'priority' | 'mail'

const PAGE_TABS: TabItem[] = [
  { key: 'rules', label: '경보 설정', icon: <Bell size={12} /> },
  { key: 'priority', label: '우선순위', icon: <Star size={12} /> },
  { key: 'mail', label: '이메일 경보', icon: <Mail size={12} /> },
]

export const AlarmSettingsPage = () => {
  const [activeTab, setActiveTab] = useState<AlarmSettingsTab>('rules')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <Bell style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span
            className="text-[13px] font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            경보 설정
          </span>
        </div>
      </div>

      <div className="flex-shrink-0 px-3 pt-2">
        <Tab
          items={PAGE_TABS}
          activeKey={activeTab}
          onChange={(k) => setActiveTab(k as AlarmSettingsTab)}
        />
      </div>

      <div className="flex flex-1 overflow-hidden min-h-0">
        {activeTab === 'rules' && <AlarmRulesTab />}
        {activeTab === 'priority' && <AlarmPriorityTab />}
        {activeTab === 'mail' && <AlarmMailTab />}
      </div>
    </div>
  )
}
