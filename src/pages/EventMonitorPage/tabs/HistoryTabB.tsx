import { useCallback, useMemo, useState } from 'react'
import { EventDetailPanel } from '@/pages/EventMonitorPage/EventDetailPanel'
import { EventGrid } from '@/pages/EventMonitorPage/EventGrid'
import { HistoryToolbarB } from '@/pages/EventMonitorPage/components/HistoryToolbarB'
import { useHistoryEvents } from '@/pages/EventMonitorPage/hooks/useHistoryEvents'
import {
  formatDateInput,
  parseDateInput,
  presetRange,
  toIsoEnd,
  toIsoStart,
  type DatePreset,
} from '@/pages/EventMonitorPage/utils/dateRange'
import {
  exportEventsCsv,
  filterByType,
  type TypeFilter,
} from '@/pages/EventMonitorPage/utils/eventFilters'
import type { AccessLogParams, AlarmLogParams, EventRecord } from '@/types/api/eventMonitor'

const PAGE_SIZE = 50

export const HistoryTabB = () => {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [datePreset, setDatePreset] = useState<DatePreset>('today')
  const [dateFrom, setDateFrom] = useState(formatDateInput(new Date()))
  const [dateTo, setDateTo] = useState(formatDateInput(new Date()))
  const [ackedOverrides, setAckedOverrides] = useState<Record<number, boolean>>({})

  const historyRange = useMemo(() => {
    if (datePreset !== 'custom') return presetRange(datePreset)
    const from = parseDateInput(dateFrom)
    const to = parseDateInput(dateTo)
    if (!from || !to) return presetRange('today')
    return { startAt: toIsoStart(from), endAt: toIsoEnd(to) }
  }, [datePreset, dateFrom, dateTo])

  const logBase = useMemo(
    () => ({
      startAt: historyRange.startAt,
      endAt: historyRange.endAt,
      page,
      pageSize: PAGE_SIZE,
    }),
    [historyRange, page],
  )

  const accessParams: AccessLogParams = logBase
  const alarmParams: AlarmLogParams = logBase

  const history = useHistoryEvents({
    typeFilter,
    accessParams,
    alarmParams,
    searchQuery: '',
    enabled: true,
  })

  const applyAckOverrides = useCallback(
    (rows: EventRecord[]) =>
      rows.map((r) => (ackedOverrides[r.id] ? { ...r, acked: true } : r)),
    [ackedOverrides],
  )

  const displayEvents = useMemo(
    () => applyAckOverrides(filterByType(history.events, typeFilter)),
    [history.events, typeFilter, applyAckOverrides],
  )

  const selectedEvent = useMemo(
    () => displayEvents.find((e) => e.id === selectedId) ?? null,
    [displayEvents, selectedId],
  )

  const handleAck = useCallback((id: number) => {
    setAckedOverrides((prev) => ({ ...prev, [id]: true }))
  }, [])

  const handleExport = useCallback(() => {
    exportEventsCsv(displayEvents)
  }, [displayEvents])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleDatePresetChange = useCallback((p: DatePreset) => {
    setDatePreset(p)
    setPage(1)
    setSelectedId(null)
  }, [])

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      <HistoryToolbarB
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        datePreset={datePreset}
        onDatePresetChange={handleDatePresetChange}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onExport={handleExport}
        onPrint={handlePrint}
        onSearch={() => void history.refetch()}
      />

      <div className="flex flex-1 overflow-hidden">
        <EventGrid
          events={displayEvents}
          selectedId={selectedId}
          onSelect={(row) => setSelectedId(row.id)}
          loading={history.isLoading}
          error={history.isError}
          mode="history"
          page={page}
          pageSize={PAGE_SIZE}
          total={history.total}
          onPageChange={setPage}
        />
        <EventDetailPanel event={selectedEvent} onAck={handleAck} />
      </div>
    </div>
  )
}
