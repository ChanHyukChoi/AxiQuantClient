import type { CSSProperties } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { EVENT_MONITOR_FONT_SIZE, EVENT_MONITOR_GRID_HEADER_FONT_SIZE } from '@/pages/EventMonitorPage/eventMonitorUi'
import type { EventRecord } from '@/types/api/eventMonitor'

interface EventGridProps {
  events: EventRecord[]
  selectedId: number | null
  onSelect: (row: EventRecord) => void
  loading?: boolean
  error?: boolean
  mode: 'live' | 'history'
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
}

const badgeStyle: CSSProperties = {
  fontSize: EVENT_MONITOR_FONT_SIZE,
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 500,
  padding: '2px 8px',
  borderRadius: 9999,
}

const TypeBadge = ({ type }: { type: EventRecord['type'] }) => {
  if (type === 'access') {
    return (
      <span style={{ ...badgeStyle, background: '#0d2b1a', color: '#4caf7d' }}>
        출입
      </span>
    )
  }
  return (
    <span style={{ ...badgeStyle, background: '#2b1616', color: '#e06060' }}>
      경보
    </span>
  )
}

const AckCell = ({ row }: { row: EventRecord }) => {
  if (row.type !== 'alarm')
    return <span style={{ color: 'var(--color-text-dim)' }}>—</span>
  return row.acked ? (
    <span style={{ ...badgeStyle, background: '#0d2b1a', color: '#4caf7d' }}>
      확인
    </span>
  ) : (
    <span style={{ ...badgeStyle, background: '#2b1616', color: '#e06060' }}>
      미확인
    </span>
  )
}

const rowBg = (row: EventRecord, selected: boolean): string => {
  if (row.type === 'alarm') {
    if (selected) return '#2a1a1a'
    return '#1e1414'
  }
  if (selected) return 'var(--color-row-selected)'
  return 'var(--color-bg)'
}

const rowHoverBg = (row: EventRecord, selected: boolean): string => {
  if (selected) return rowBg(row, true)
  if (row.type === 'alarm') return '#221818'
  return 'var(--color-btn-hover)'
}

export const EventGrid = ({
  events,
  selectedId,
  onSelect,
  loading = false,
  error = false,
  mode,
  page,
  pageSize,
  total,
  onPageChange,
}: EventGridProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
      <div className="flex-1 overflow-auto app-scrollbar">
        <table
          style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}
        >
          <thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: 'var(--color-sidebar)',
            }}
          >
            <tr>
              {[
                '일시',
                '종류',
                '이벤트',
                '카드 번호',
                '카드 사용자',
                '제어기',
                '장치',
                'ACK',
              ].map((h) => (
                <th key={h} style={headerCellStyle}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-8 app-text-md" style={emptyStyle}>
                  불러오는 중...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 app-text-md"
                  style={{ ...emptyStyle, color: '#e06060' }}
                >
                  이력을 불러오지 못했습니다.
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 app-text-md" style={emptyStyle}>
                  표시할 이벤트가 없습니다.
                </td>
              </tr>
            ) : (
              events.map((row) => {
                const selected = row.id === selectedId
                return (
                  <tr
                    key={`${row.type}-${row.id}`}
                    onClick={() => onSelect(row)}
                    style={{
                      background: rowBg(row, selected),
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLTableRowElement).style.background =
                        rowHoverBg(row, selected)
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLTableRowElement).style.background = rowBg(
                        row,
                        selected,
                      )
                    }}
                  >
                    <td style={cellStyle}>{row.ts}</td>
                    <td style={cellStyle}>
                      <TypeBadge type={row.type} />
                    </td>
                    <td style={cellStyle}>{row.event}</td>
                    <td style={cellStyle}>{row.card || '—'}</td>
                    <td style={cellStyle}>{row.user || '—'}</td>
                    <td style={cellStyle}>{row.ctrl || '—'}</td>
                    <td style={cellStyle}>{row.device || '—'}</td>
                    <td style={cellStyle}>
                      <AckCell row={row} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div
        className="flex-shrink-0 flex items-center justify-between app-text-md"
        style={{
          padding: '5px 12px',
          background: 'var(--color-sidebar)',
          borderTop: '0.5px solid var(--color-border)',
          color: 'var(--color-text-dim)',
        }}
      >
        {mode === 'live' ? (
          <span>최대 200건 표시</span>
        ) : (
          <>
            <span>
              전체 {total}건 · {page} / {totalPages} 페이지
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="default"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                leftIcon={<ChevronLeft size={14} />}
              />
              <Button
                size="sm"
                variant="default"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                leftIcon={<ChevronRight size={14} />}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const headerCellStyle: CSSProperties = {
  padding: '6px 10px',
  textAlign: 'left',
  fontSize: EVENT_MONITOR_GRID_HEADER_FONT_SIZE,
  fontWeight: 500,
  color: 'var(--color-text-dim)',
  borderBottom: '0.5px solid var(--color-border)',
  whiteSpace: 'nowrap',
}

const cellStyle: CSSProperties = {
  padding: '6px 10px',
  fontSize: EVENT_MONITOR_FONT_SIZE,
  color: 'var(--color-cell)',
  borderBottom: '0.5px solid var(--color-border-subtle)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

const emptyStyle: CSSProperties = {
  color: 'var(--color-text-subtle)',
}
