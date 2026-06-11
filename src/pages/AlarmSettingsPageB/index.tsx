import { AlarmSettingsShell } from '@/pages/AlarmSettingsPage/AlarmSettingsShell'
import { AlarmPriorityTabB } from '@/pages/AlarmSettingsPage/tabs/AlarmPriorityTabB'
import { AlarmRulesTabB } from '@/pages/AlarmSettingsPage/tabs/AlarmRulesTabB'

export const AlarmSettingsPageB = () => (
  <AlarmSettingsShell
    rulesTab={<AlarmRulesTabB />}
    priorityTab={<AlarmPriorityTabB />}
    variantPaths={{ a: '/alarm-settings', b: '/alarm-settings-b' }}
    title="경보 설정"
  />
)
