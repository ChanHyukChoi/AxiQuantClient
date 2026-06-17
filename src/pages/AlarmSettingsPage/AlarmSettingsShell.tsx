import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, Mail, Star } from 'lucide-react'
import { Tab, type TabItem } from '@/components/primitive/Tab'
import { PageHeader } from '@/layouts/PageHeader'
import { AlarmMailTab } from '@/pages/AlarmSettingsPage/tabs/AlarmMailTab'

export type AlarmSettingsTab = 'rules' | 'priority' | 'mail'

interface AlarmSettingsShellProps {
  rulesTab: ReactNode
  priorityTab: ReactNode
  title?: string
}

export const AlarmSettingsShell = ({
  rulesTab,
  priorityTab,
  title,
}: AlarmSettingsShellProps) => {
  const { t } = useTranslation(['alarm', 'nav'])
  const [activeTab, setActiveTab] = useState<AlarmSettingsTab>('rules')

  const pageTabs = useMemo<TabItem[]>(
    () => [
      { key: 'rules', label: t('alarm:tab.rules'), icon: <Bell size={12} /> },
      { key: 'priority', label: t('alarm:tab.priority'), icon: <Star size={12} /> },
      { key: 'mail', label: t('alarm:tab.mail'), icon: <Mail size={12} /> },
    ],
    [t],
  )

  const pageTitle = title ?? t('nav:menu.alarm-settings')

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader title={pageTitle} icon={<Bell size={15} />} />

      <div className="flex-shrink-0 px-3 pt-2">
        <Tab
          items={pageTabs}
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
