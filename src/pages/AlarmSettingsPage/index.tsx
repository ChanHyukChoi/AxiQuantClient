import { AlarmSettingsShell } from '@/pages/AlarmSettingsPage/AlarmSettingsShell'
import { AlarmPriorityTab } from '@/pages/AlarmSettingsPage/tabs/AlarmPriorityTab'
import { AlarmRulesTab } from '@/pages/AlarmSettingsPage/tabs/AlarmRulesTab'

export const AlarmSettingsPage = () => (
  <AlarmSettingsShell
    rulesTab={<AlarmRulesTab />}
    priorityTab={<AlarmPriorityTab />}
  />
)
