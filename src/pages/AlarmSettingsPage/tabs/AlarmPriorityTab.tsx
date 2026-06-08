import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { AlarmPriorityDrawer } from '@/pages/AlarmSettingsPage/components/AlarmPriorityDrawer'
import { AlarmPriorityListPane } from '@/pages/AlarmSettingsPage/components/AlarmPriorityListPane'
import { useAlarmPriorities, useCreateAlarmPriority } from '@/hooks/api/useAlarmSettings'
import type { AlarmPriorityInfo } from '@/types/api'

export const AlarmPriorityTab = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const { data: list, isLoading, isError } = useAlarmPriorities()
  const createMut = useCreateAlarmPriority()

  const items = list ?? []

  const selected = useMemo(
    () => items.find((a) => a.id === selectedId) ?? null,
    [items, selectedId],
  )

  const handleAdd = async () => {
    const maxPriority = items.reduce((m, p) => Math.max(m, p.priority), -1)
    const ok = await createMut.mutateAsync({
      priority: maxPriority + 1,
      color: '#4f9cf9',
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
        <AlarmPriorityListPane
          items={items}
          selectedId={selectedId}
          loading={isLoading}
          error={isError || list === null}
          onSelect={(item: AlarmPriorityInfo) => setSelectedId(item.id)}
        />
        <AlarmPriorityDrawer item={selected} onDeleted={() => setSelectedId(null)} />
      </div>
    </div>
  )
}
