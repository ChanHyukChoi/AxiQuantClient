import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { AlarmRuleDrawer } from '@/pages/AlarmSettingsPage/components/AlarmRuleDrawer'
import { AlarmRulesListPane } from '@/pages/AlarmSettingsPage/components/AlarmRulesListPane'
import { useAlarmRulesData } from '@/pages/AlarmSettingsPage/useAlarmRulesData'
import { useAlarmRuleEditor } from '@/pages/AlarmSettingsPage/useAlarmRuleEditor'
import type { AlarmRuleDisplay } from '@/pages/AlarmSettingsPage/alarmRuleTypes'

export const AlarmRulesTab = () => {
  const data = useAlarmRulesData()

  const editor = useAlarmRuleEditor({
    rule: data.selectedRule,
    useMock: data.useMock,
    scpNameMap: data.scpNameMap,
    patchMockRule: data.patchMockRule,
    addMockRule: data.addMockRule,
    removeMockRule: data.removeMockRule,
    onDeleted: data.onRuleDeleted,
  })

  const listAlarms = data.filteredRules.map((r) => ({
    id: r.id,
    name: r.name,
    active: r.active,
    deviceId: r.deviceId,
    deviceType: r.deviceType,
    eventCondition: r.eventCondition,
  }))

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-end flex-shrink-0 px-3 py-1.5"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Plus size={12} />}
          loading={editor.isAdding}
          onClick={() => void editor.handleAdd()}
        >
          추가
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <AlarmRulesListPane
          alarms={listAlarms}
          selectedId={data.selectedId}
          searchQuery={data.searchQuery}
          loading={data.isLoading}
          error={data.isError}
          scpNameMap={data.scpNameMap}
          onSearch={data.setSearchQuery}
          onSelect={(a) => {
            const rule = data.filteredRules.find((r) => r.id === a.id)
            if (rule) data.selectRule(rule as AlarmRuleDisplay)
          }}
        />
        <AlarmRuleDrawer
          rule={data.selectedRule}
          useMock={data.useMock}
          scps={data.scpList}
          scpNameMap={data.scpNameMap}
          editor={editor}
        />
      </div>
    </div>
  )
}
