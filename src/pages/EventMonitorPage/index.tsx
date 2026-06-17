import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Activity } from 'lucide-react'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { PageHeader } from '@/layouts/PageHeader'
import { EventDetailPanel } from '@/pages/EventMonitorPage/EventDetailPanel'
import { EventGrid } from '@/pages/EventMonitorPage/EventGrid'
import { MonitorToolbar, type MonitorMode } from '@/pages/EventMonitorPage/MonitorToolbar'
import { useHistoryEvents } from '@/pages/EventMonitorPage/hooks/useHistoryEvents'
import { useLiveEvents } from '@/pages/EventMonitorPage/hooks/useLiveEvents'
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
const EVENT_GRID_MIN_WIDTH = 640

export const EventMonitorPage = () => {
  const { t } = useTranslation('nav')
  const [mode, setMode] = useState<MonitorMode>('live')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [datePreset, setDatePreset] = useState<DatePreset>('today')
  const [dateFrom, setDateFrom] = useState(formatDateInput(new Date()))
  const [dateTo, setDateTo] = useState(formatDateInput(new Date()))
  const [ackedOverrides, setAckedOverrides] = useState<Record<number, boolean>>({})

  const live = useLiveEvents()

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
    enabled: mode === 'history',
  })

  const applyAckOverrides = useCallback(
    (rows: EventRecord[]) =>
      rows.map((r) => (ackedOverrides[r.id] ? { ...r, acked: true } : r)),
    [ackedOverrides],
  )

  const liveFiltered = useMemo(
    () => applyAckOverrides(filterByType(live.events, typeFilter)),
    [live.events, typeFilter, applyAckOverrides],
  )

  const historyFiltered = useMemo(
    () => applyAckOverrides(filterByType(history.events, typeFilter)),
    [history.events, typeFilter, applyAckOverrides],
  )

  const displayEvents = mode === 'live' ? liveFiltered : historyFiltered

  const selectedEvent = useMemo(
    () => displayEvents.find((e) => e.id === selectedId) ?? null,
    [displayEvents, selectedId],
  )

  const handleAck = useCallback(
    (id: number) => {
      setAckedOverrides((prev) => ({ ...prev, [id]: true }))
      if (mode === 'live') live.ack(id)
    },
    [mode, live],
  )

  const handleExport = useCallback(() => {
    exportEventsCsv(displayEvents)
  }, [displayEvents])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleModeChange = (next: MonitorMode) => {
    setMode(next)
    setSelectedId(null)
    setPage(1)
  }

  const handleSearch = useCallback(() => {
    if (mode === 'history') void history.refetch()
  }, [mode, history])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader title={t('menu.monitor')} icon={<Activity size={15} />} />

      <MonitorToolbar
        mode={mode}
        onModeChange={handleModeChange}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        paused={live.paused}
        onTogglePause={() => live.setPaused((p) => !p)}
        onClear={live.clear}
        isConnected={live.isConnected}
        datePreset={datePreset}
        onDatePresetChange={setDatePreset}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onExport={handleExport}
        onPrint={handlePrint}
        onSearch={handleSearch}
      />

      <SplitDrawerLayout
        minMainWidth={EVENT_GRID_MIN_WIDTH}
        main={
          <EventGrid
            events={displayEvents}
            selectedId={selectedId}
            onSelect={(row) => setSelectedId(row.id)}
            loading={mode === 'history' && history.isLoading}
            error={mode === 'history' && history.isError}
            mode={mode}
            page={page}
            pageSize={PAGE_SIZE}
            total={mode === 'history' ? history.total : displayEvents.length}
            onPageChange={setPage}
          />
        }
        drawer={<EventDetailPanel event={selectedEvent} onAck={handleAck} />}
      />
    </div>
  )
}
