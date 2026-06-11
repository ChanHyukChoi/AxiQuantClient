import { useCallback, useMemo, useState } from 'react'
import { EventDetailPanel } from '@/pages/EventMonitorPage/EventDetailPanel'
import { EventGrid } from '@/pages/EventMonitorPage/EventGrid'
import { LiveToolbarB } from '@/pages/EventMonitorPage/components/LiveToolbarB'
import { useLiveEvents } from '@/pages/EventMonitorPage/hooks/useLiveEvents'
import { filterByType, type TypeFilter } from '@/pages/EventMonitorPage/utils/eventFilters'
import type { EventRecord } from '@/types/api/eventMonitor'

export const LiveTabB = () => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [ackedOverrides, setAckedOverrides] = useState<Record<number, boolean>>({})

  const live = useLiveEvents()

  const applyAckOverrides = useCallback(
    (rows: EventRecord[]) =>
      rows.map((r) => (ackedOverrides[r.id] ? { ...r, acked: true } : r)),
    [ackedOverrides],
  )

  const displayEvents = useMemo(
    () => applyAckOverrides(filterByType(live.events, typeFilter)),
    [live.events, typeFilter, applyAckOverrides],
  )

  const selectedEvent = useMemo(
    () => displayEvents.find((e) => e.id === selectedId) ?? null,
    [displayEvents, selectedId],
  )

  const handleAck = useCallback(
    (id: number) => {
      setAckedOverrides((prev) => ({ ...prev, [id]: true }))
      live.ack(id)
    },
    [live],
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      <LiveToolbarB
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        paused={live.paused}
        onTogglePause={() => live.setPaused((p) => !p)}
        onClear={live.clear}
        isConnected={live.isConnected}
      />

      <div className="flex flex-1 overflow-hidden">
        <EventGrid
          events={displayEvents}
          selectedId={selectedId}
          onSelect={(row) => setSelectedId(row.id)}
          mode="live"
          page={1}
          pageSize={50}
          total={displayEvents.length}
          onPageChange={() => {}}
        />
        <EventDetailPanel event={selectedEvent} onAck={handleAck} />
      </div>
    </div>
  )
}
