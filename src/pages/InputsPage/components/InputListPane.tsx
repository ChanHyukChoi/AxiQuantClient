import { SearchField } from '@/components/primitive/SearchField'
import { Select } from '@/components/primitive/Select'
import { Badge } from '@/components/primitive/Badge'
import type { InputDisplayRow } from '@/pages/InputsPage/inputsMockData'
import { inputRowKey } from '@/pages/InputsPage/inputsMockData'
import {
  formatInputAddr,
  formatSioName,
  inputLabel,
} from '@/pages/InputsPage/utils/inputDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { ScpInfo } from '@/types/api'

interface InputListPaneProps {
  rows: InputDisplayRow[]
  scps: ScpInfo[]
  selectedKey: string | null
  searchQuery: string
  scpFilter: number | 'all'
  loading: boolean
  error: boolean
  onSearch: (q: string) => void
  onScpFilterChange: (v: number | 'all') => void
  onSelect: (row: InputDisplayRow) => void
}

export const InputListPane = ({
  rows,
  scps,
  selectedKey,
  searchQuery,
  scpFilter,
  loading,
  error,
  onSearch,
  onScpFilterChange,
  onSelect,
}: InputListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 280, borderRight: '0.5px solid var(--color-border)' }}
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
      <SearchField value={searchQuery} placeholder="입력 검색..." onChange={onSearch} />
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
          {searchQuery.trim() || scpFilter !== 'all'
            ? '검색 결과가 없습니다.'
            : '등록된 입력이 없습니다.'}
        </p>
      ) : (
        rows.map((row) => {
          const key = inputRowKey(row)
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
                    style={{ color: 'var(--color-text)' }}
                  >
                    {inputLabel(row)}
                  </span>
                  <span
                    className="text-[13px] block mt-0.5 truncate"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    {row.scpName} · {formatSioName(row.sio, row.sioName)} ·{' '}
                    {formatInputAddr(row.addr)}
                  </span>
                </div>
                <Badge variant={isDeviceActive(row.active) ? 'on' : 'off'}>
                  {isDeviceActive(row.active) ? '활성' : '비활성'}
                </Badge>
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
