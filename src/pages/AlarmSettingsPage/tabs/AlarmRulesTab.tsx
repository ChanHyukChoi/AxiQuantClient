import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { AlarmRuleDrawer } from '@/pages/AlarmSettingsPage/components/AlarmRuleDrawer'
import { AlarmRulesListPane } from '@/pages/AlarmSettingsPage/components/AlarmRulesListPane'
import { useAlarms, useCreateAlarm } from '@/hooks/api/useAlarmSettings'
import { useScps } from '@/hooks/api/useDeviceControl'
import type { AlarmInfo } from '@/types/api'

export const AlarmRulesTab = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: alarmList, isLoading, isError } = useAlarms()
  const { data: scps } = useScps()
  const createMut = useCreateAlarm()

  const scpNameMap = useMemo(() => {
    const map: Record<number, string> = {}
    ;(scps ?? []).forEach((s) => {
      map[s.id] = s.name
    })
    return map
  }, [scps])

  const filtered = useMemo(() => {
    const list = alarmList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        String(a.id).includes(q) ||
        a.deviceType.toLowerCase().includes(q),
    )
  }, [alarmList, searchQuery])

  const selected = useMemo(
    () => (alarmList ?? []).find((a) => a.id === selectedId) ?? null,
    [alarmList, selectedId],
  )

  const handleAdd = async () => {
    const ok = await createMut.mutateAsync({
      name: '새 경보',
      active: 1,
      deviceId: 0,
      deviceType: '',
      eventCondition: '',
    })
    if (ok && alarmList) {
      const newest = [...(alarmList ?? [])].sort((a, b) => b.id - a.id)[0]
      if (newest) setSelectedId(newest.id)
    }
  }

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
          loading={createMut.isPending}
          onClick={() => void handleAdd()}
        >
          추가
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <AlarmRulesListPane
          alarms={filtered}
          selectedId={selectedId}
          searchQuery={searchQuery}
          loading={isLoading}
          error={isError || alarmList === null}
          scpNameMap={scpNameMap}
          onSearch={setSearchQuery}
          onSelect={(a: AlarmInfo) => setSelectedId(a.id)}
        />
        <AlarmRuleDrawer
          alarm={selected}
          scpNameMap={scpNameMap}
          onDeleted={() => setSelectedId(null)}
        />
      </div>
    </div>
  )
}
