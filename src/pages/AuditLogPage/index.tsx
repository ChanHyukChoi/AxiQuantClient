import { useCallback, useMemo, useState } from 'react'
import { ClipboardList } from 'lucide-react'
import { AuditGrid } from '@/pages/AuditLogPage/AuditGrid'
import { AuditToolbar } from '@/pages/AuditLogPage/AuditToolbar'
import {
  formatDateInput,
  parseDateInput,
  presetRange,
  toIsoEnd,
  toIsoStart,
  type DatePreset,
} from '@/pages/EventMonitorPage/utils/dateRange'
import { useAuditLog } from '@/hooks/api/useAuditLog'
import { useUsers } from '@/hooks/api/useUsers'
import type { AuditLogParams } from '@/types/api/audit'

export const AuditLogPage = () => {
  const [datePreset, setDatePreset] = useState<DatePreset>('today')
  const [dateFrom, setDateFrom] = useState(formatDateInput(new Date()))
  const [dateTo, setDateTo] = useState(formatDateInput(new Date()))
  const [userId, setUserId] = useState<number | ''>('')
  const [actionType, setActionType] = useState('')
  const [dataType, setDataType] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  const { data: users } = useUsers()
  const userList = users ?? []

  const range = useMemo(() => {
    if (datePreset !== 'custom') return presetRange(datePreset)
    const from = parseDateInput(dateFrom)
    const to = parseDateInput(dateTo)
    if (!from || !to) return presetRange('today')
    return { startAt: toIsoStart(from), endAt: toIsoEnd(to) }
  }, [datePreset, dateFrom, dateTo])

  const params: AuditLogParams = useMemo(
    () => ({
      startAt: range.startAt,
      endAt: range.endAt,
      userId: userId === '' ? undefined : userId,
      actionType: actionType || undefined,
      dataType: dataType || undefined,
      page,
      pageSize,
    }),
    [range, userId, actionType, dataType, page, pageSize],
  )

  const { data, isLoading, isError } = useAuditLog(params)

  const items = data?.items ?? []
  const total = data?.total ?? 0

  const handleExport = useCallback(() => {
    const header = ['시간', '사용자', '클라이언트', '동작', '데이터유형', '컨트롤러', '데이터']
    const lines = items.map((r) =>
      [r.ts, r.user, r.clientType, r.actionType, r.dataType, r.controller, r.data].join(','),
    )
    const csv = [header.join(','), ...lines].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [items])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <ClipboardList style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
            운영 기록
          </span>
        </div>
      </div>

      <AuditToolbar
        datePreset={datePreset}
        onDatePresetChange={(p) => {
          setDatePreset(p)
          setPage(1)
        }}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        userId={userId}
        onUserIdChange={(id) => {
          setUserId(id)
          setPage(1)
        }}
        users={userList}
        actionType={actionType}
        onActionTypeChange={(v) => {
          setActionType(v)
          setPage(1)
        }}
        dataType={dataType}
        onDataTypeChange={(v) => {
          setDataType(v)
          setPage(1)
        }}
        onExport={handleExport}
        onPrint={handlePrint}
      />

      <AuditGrid
        items={items}
        loading={isLoading}
        error={isError}
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </div>
  )
}
