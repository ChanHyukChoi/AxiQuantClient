import type { CSSProperties } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { actionBadgeStyle } from '@/pages/AuditLogPage/utils/auditBadge'
import type { AuditLogItem } from '@/types/api/audit'

interface AuditGridProps {
  items: AuditLogItem[]
  loading: boolean
  error: boolean
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const cellStyle: CSSProperties = {
  padding: '6px 10px',
  fontSize: 12,
  color: 'var(--color-cell)',
  borderBottom: '0.5px solid var(--color-border-subtle)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export const AuditGrid = ({
  items,
  loading,
  error,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: AuditGridProps) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
      <div className="flex-1 overflow-auto app-scrollbar">
        <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-sidebar)' }}>
            <tr>
              {['시간', '사용자', '클라이언트 유형', '동작 유형', '데이터 유형', '컨트롤러', '데이터'].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: '6px 10px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'var(--color-text-dim)',
                      borderBottom: '0.5px solid var(--color-border)',
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
                  불러오는 중...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[12px]" style={{ color: '#e06060' }}>
                  운영 기록을 불러오지 못했습니다.
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
                  표시할 기록이 없습니다.
                </td>
              </tr>
            ) : (
              items.map((row) => (
                <tr key={row.id} style={{ background: 'var(--color-bg)' }}>
                  <td style={cellStyle}>{row.ts}</td>
                  <td style={cellStyle}>{row.user || '—'}</td>
                  <td style={cellStyle}>{row.clientType || '—'}</td>
                  <td style={cellStyle}>
                    <span
                      className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                      style={actionBadgeStyle(String(row.actionType))}
                    >
                      {row.actionType}
                    </span>
                  </td>
                  <td style={cellStyle}>{row.dataType || '—'}</td>
                  <td style={cellStyle}>{row.controller || '—'}</td>
                  <td style={cellStyle} title={row.data}>
                    {row.data || '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        className="flex-shrink-0 flex items-center justify-between gap-2 flex-wrap text-[11px]"
        style={{
          padding: '5px 12px',
          background: 'var(--color-sidebar)',
          borderTop: '0.5px solid var(--color-border)',
          color: 'var(--color-text-dim)',
        }}
      >
        <span>전체 {total}건</span>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="text-[11px] px-1.5 py-0.5 rounded"
            style={{
              background: 'var(--color-btn-hover)',
              border: '0.5px solid var(--color-btn-default-border)',
              color: 'var(--color-text)',
            }}
          >
            {[50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}건/페이지
              </option>
            ))}
          </select>
          <Button
            size="sm"
            variant="default"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            leftIcon={<ChevronLeft size={14} />}
          />
          <span>
            {page} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="default"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            leftIcon={<ChevronRight size={14} />}
          />
        </div>
      </div>
    </div>
  )
}
