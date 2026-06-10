import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { AlarmMailDrawer } from '@/pages/AlarmSettingsPage/components/AlarmMailDrawer'
import { AlarmMailListPane } from '@/pages/AlarmSettingsPage/components/AlarmMailListPane'
import { useAlarmMails, useAlarms, useCreateAlarmMail } from '@/hooks/api/useAlarmSettings'
import type { AlarmMailInfo } from '@/types/api'

export const AlarmMailTab = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: mailList, isLoading, isError } = useAlarmMails()
  const { data: alarms } = useAlarms()
  const createMut = useCreateAlarmMail()

  const items = mailList ?? []
  const alarmList = alarms ?? []

  const alarmNameMap = useMemo(() => {
    const map: Record<number, string> = {}
    alarmList.forEach((a) => {
      map[a.id] = a.name?.trim() || '경보'
    })
    return map
  }, [alarmList])

  const selected = useMemo(
    () => items.find((m) => m.id === selectedId) ?? null,
    [items, selectedId],
  )

  const handleAdd = async () => {
    const ok = await createMut.mutateAsync({
      name: '새 이메일 경보',
      alarmIds: [],
      emails: [''],
    })
    if (ok) {
      const sorted = [...items].sort((a, b) => b.id - a.id)
      if (sorted[0]) setSelectedId(sorted[0].id)
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
        <AlarmMailListPane
          items={items}
          selectedId={selectedId}
          loading={isLoading}
          error={isError || mailList === null}
          onSelect={(item: AlarmMailInfo) => setSelectedId(item.id)}
        />
        <AlarmMailDrawer
          item={selected}
          alarms={alarmList}
          alarmNameMap={alarmNameMap}
          onDeleted={() => setSelectedId(null)}
        />
      </div>
    </div>
  )
}
