import { useCallback, useMemo, useState } from 'react'
import { EventDetailPanel } from '@/pages/EventMonitorPage/EventDetailPanel'
import { EventGrid } from '@/pages/EventMonitorPage/EventGrid'
import { MonitorToolbar, type MonitorMode, type TypeFilter } from '@/pages/EventMonitorPage/MonitorToolbar'
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
import { useScps } from '@/hooks/useDevices'
import type { AccessLogParams, AlarmLogParams, EventRecord } from '@/types/api/eventMonitor'

const PAGE_SIZE = 50

const filterByType = (rows: EventRecord[], typeFilter: TypeFilter): EventRecord[] => {
  if (typeFilter === 'all') return rows
  return rows.filter((r) => r.type === typeFilter)
}

const filterBySearch = (rows: EventRecord[], q: string): EventRecord[] => {
  const needle = q.trim().toLowerCase()
  if (!needle) return rows
  return rows.filter((r) =>
    [r.event, r.card, r.user, r.device, r.ctrl].join(' ').toLowerCase().includes(needle),
  )
}

export const EventMonitorPage = () => {
  const [mode, setMode] = useState<MonitorMode>('live')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [scpId, setScpId] = useState<number | ''>('')
  const [page, setPage] = useState(1)
  const [datePreset, setDatePreset] = useState<DatePreset>('today')
  const [dateFrom, setDateFrom] = useState(formatDateInput(new Date()))
  const [dateTo, setDateTo] = useState(formatDateInput(new Date()))
  const [ackedOverrides, setAckedOverrides] = useState<Record<number, boolean>>({})

  const { data: scpList } = useScps()
  const scps = scpList ?? []

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
      cardNo: searchQuery.trim() || undefined,
      scpId: scpId === '' ? undefined : scpId,
      page,
      pageSize: PAGE_SIZE,
    }),
    [historyRange, searchQuery, scpId, page],
  )

  const accessParams: AccessLogParams = logBase
  const alarmParams: AlarmLogParams = logBase

  const history = useHistoryEvents({
    typeFilter,
    accessParams,
    alarmParams,
    searchQuery,
    enabled: mode === 'history',
  })

  const applyAckOverrides = useCallback(
    (rows: EventRecord[]) =>
      rows.map((r) => (ackedOverrides[r.id] ? { ...r, acked: true } : r)),
    [ackedOverrides],
  )

  const liveFiltered = useMemo(
    () =>
      applyAckOverrides(filterBySearch(filterByType(live.events, typeFilter), searchQuery)),
    [live.events, typeFilter, searchQuery, applyAckOverrides],
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
    const header = ['일시', '종류', '이벤트', '카드번호', '사용자', '제어기', '장치', 'ACK']
    const lines = displayEvents.map((r) =>
      [
        r.ts,
        r.type === 'alarm' ? '경보' : '출입',
        r.event,
        r.card,
        r.user,
        r.ctrl,
        r.device,
        r.type === 'alarm' ? (r.acked ? '확인' : '미확인') : '',
      ].join(','),
    )
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `event-history-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [displayEvents])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleModeChange = (next: MonitorMode) => {
    setMode(next)
    setSelectedId(null)
    setPage(1)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <MonitorToolbar
        mode={mode}
        onModeChange={handleModeChange}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        paused={live.paused}
        onTogglePause={() => live.setPaused((p) => !p)}
        onClear={live.clear}
        isConnected={live.isConnected}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        scpId={scpId}
        onScpChange={setScpId}
        scps={scps}
        datePreset={datePreset}
        onDatePresetChange={setDatePreset}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onExport={handleExport}
        onPrint={handlePrint}
      />

      {mode === 'history' && history.apiNotReady ? (
        <div
          className="mx-3 mt-2 px-3 py-2 rounded text-[12px]"
          style={{
            background: 'var(--color-btn-hover)',
            color: 'var(--color-text-muted)',
            border: '0.5px solid var(--color-border)',
          }}
        >
          출입·경보 이력 API가 서버에 아직 구현되지 않았습니다.
        </div>
      ) : null}

      <div className="flex flex-1 overflow-hidden">
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
        <EventDetailPanel event={selectedEvent} onAck={handleAck} />
      </div>
    </div>
  )
}

