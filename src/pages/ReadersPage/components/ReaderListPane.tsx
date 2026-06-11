import { SearchField } from '@/components/primitive/SearchField'
import { Select } from '@/components/primitive/Select'
import { ReaderKindBadge } from '@/pages/ReadersPage/components/ReaderDetailContent'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readersMockData'
import { readerRowKey } from '@/pages/ReadersPage/utils/readerDisplay'
import {
  formatDefMode,
  formatReaderAddr,
  formatSioName,
  readerLabel,
  type ReaderKindFilter,
} from '@/pages/ReadersPage/utils/readerDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { ScpInfo } from '@/types/api'

interface ReaderListPaneProps {
  rows: ReaderDisplayRow[]
  scps: ScpInfo[]
  selectedKey: string | null
  searchQuery: string
  scpFilter: number | 'all'
  kindFilter: ReaderKindFilter
  loading: boolean
  error: boolean
  onSearch: (q: string) => void
  onScpFilterChange: (v: number | 'all') => void
  onKindFilterChange: (v: ReaderKindFilter) => void
  onSelect: (row: ReaderDisplayRow) => void
}

export const ReaderListPane = ({
  rows,
  scps,
  selectedKey,
  searchQuery,
  scpFilter,
  kindFilter,
  loading,
  error,
  onSearch,
  onScpFilterChange,
  onKindFilterChange,
  onSelect,
}: ReaderListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 260, borderRight: '0.5px solid var(--color-border)' }}
  >
    <div
      className="flex-shrink-0 flex flex-col gap-1.5"
      style={{
        padding: '7px 12px',
        background: 'var(--color-sidebar)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <Select
        value={scpFilter === 'all' ? 'all' : String(scpFilter)}
        onChange={(v) => onScpFilterChange(v === 'all' ? 'all' : Number(v))}
        options={[
          { value: 'all', label: '주제어기 전체' },
          ...scps.map((s) => ({ value: String(s.id), label: s.name })),
        ]}
      />
      <Select
        value={kindFilter}
        onChange={(v) => onKindFilterChange(v as ReaderKindFilter)}
        options={[
          { value: 'all', label: '유형 전체' },
          { value: 'general', label: '일반' },
          { value: 'standalone', label: '단독' },
          { value: 'bio', label: '바이오' },
        ]}
      />
      <SearchField value={searchQuery} placeholder="리더 검색..." onChange={onSearch} />
    </div>

    <div className="flex-1 overflow-y-auto app-scrollbar">
      {loading ? (
        <p className="text-[14px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
          불러오는 중...
        </p>
      ) : error ? (
        <p className="text-[14px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
          목록을 불러오지 못했습니다.
        </p>
      ) : rows.length === 0 ? (
        <p className="text-[14px] text-center py-8 px-3" style={{ color: 'var(--color-text-subtle)' }}>
          등록된 리더가 없습니다.
        </p>
      ) : (
        rows.map((row) => {
          const key = readerRowKey(row)
          const isSelected = key === selectedKey
          return (
            <div
              key={key}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(row)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(row)
                }
              }}
              className="px-3.5 py-2.5 cursor-pointer"
              style={{
                background: isSelected ? 'var(--color-row-selected)' : 'transparent',
                borderBottom: '0.5px solid var(--color-border-subtle)',
                borderRight: isSelected
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span
                    className="text-[14px] font-medium block truncate"
                    style={{
                      color: isDeviceActive(row.active)
                        ? 'var(--color-text)'
                        : 'var(--color-text-dim)',
                    }}
                  >
                    {readerLabel(row)}
                  </span>
                  <span
                    className="text-[13px] block mt-0.5 truncate"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    {row.scpName} · {formatSioName(row.sio, row.sioName)} ·{' '}
                    {formatReaderAddr(row.addr)}
                  </span>
                  <span
                    className="text-[12px] block mt-0.5 truncate"
                    style={{ color: 'var(--color-text-dim)' }}
                  >
                    {formatDefMode(row.defmode)}
                  </span>
                </div>
                <ReaderKindBadge kind={row.kind} />
              </div>
            </div>
          )
        })
      )}
    </div>

    <div
      className="flex-shrink-0 text-[13px] px-3 py-1.5"
      style={{
        background: 'var(--color-sidebar)',
        borderTop: '0.5px solid var(--color-border)',
        color: 'var(--color-text-dim)',
      }}
    >
      전체 {rows.length}건
    </div>
  </div>
)
