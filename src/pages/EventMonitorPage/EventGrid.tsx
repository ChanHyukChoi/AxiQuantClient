import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { CSSProperties } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import {
  EVENT_MONITOR_FONT_SIZE,
  EVENT_MONITOR_GRID_HEADER_FONT_SIZE,
} from '@/pages/EventMonitorPage/eventMonitorUi'
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

const TypeBadge = ({ type, label }: { type: EventRecord['type']; label: string }) => {
  if (type === 'access') {
    return (
      <span style={{ ...badgeStyle, background: '#0d2b1a', color: '#4caf7d' }}>{label}</span>
    )
  }
  return <span style={{ ...badgeStyle, background: '#2b1616', color: '#e06060' }}>{label}</span>
}

const AckCell = ({
  row,
  confirmedLabel,
  unconfirmedLabel,
  empty,
}: {
  row: EventRecord
  confirmedLabel: string
  unconfirmedLabel: string
  empty: string
}) => {
  if (row.type !== 'alarm') return <span style={{ color: 'var(--color-text-dim)' }}>{empty}</span>
  return row.acked ? (
    <span style={{ ...badgeStyle, background: '#0d2b1a', color: '#4caf7d' }}>{confirmedLabel}</span>
  ) : (
    <span style={{ ...badgeStyle, background: '#2b1616', color: '#e06060' }}>{unconfirmedLabel}</span>
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
  const { t } = useTranslation(['eventMonitor', 'common'])
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const headers = useMemo(
    () => [
      t('eventMonitor:field.ts'),
      t('eventMonitor:field.type'),
      t('eventMonitor:field.event'),
      t('eventMonitor:field.card'),
      t('eventMonitor:field.user'),
      t('eventMonitor:field.controller'),
      t('eventMonitor:field.device'),
      t('eventMonitor:field.ack'),
    ],
    [t],
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
      <div className="flex-1 overflow-auto app-scrollbar">
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
          <thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: 'var(--color-sidebar)',
            }}
          >
            <tr>
              {headers.map((h) => (
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
                  {t('eventMonitor:loading')}
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 app-text-md"
                  style={{ ...emptyStyle, color: '#e06060' }}
                >
                  {t('eventMonitor:loadError')}
                </td>
              </tr>
            ) : events.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 app-text-md" style={emptyStyle}>
                  {t('eventMonitor:empty')}
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
                      ;(e.currentTarget as HTMLTableRowElement).style.background = rowHoverBg(
                        row,
                        selected,
                      )
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
                      <TypeBadge
                        type={row.type}
                        label={
                          row.type === 'alarm'
                            ? t('eventMonitor:type.alarm')
                            : t('eventMonitor:type.access')
                        }
                      />
                    </td>
                    <td style={cellStyle}>{row.event}</td>
                    <td style={cellStyle}>{row.card || t('common:empty')}</td>
                    <td style={cellStyle}>{row.user || t('common:empty')}</td>
                    <td style={cellStyle}>{row.ctrl || t('common:empty')}</td>
                    <td style={cellStyle}>{row.device || t('common:empty')}</td>
                    <td style={cellStyle}>
                      <AckCell
                        row={row}
                        confirmedLabel={t('eventMonitor:ack.confirmed')}
                        unconfirmedLabel={t('eventMonitor:ack.unconfirmed')}
                        empty={t('common:empty')}
                      />
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
          <span>{t('eventMonitor:liveMaxHint')}</span>
        ) : (
          <>
            <span>
              {t('eventMonitor:pagination', { total, page, totalPages })}
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
