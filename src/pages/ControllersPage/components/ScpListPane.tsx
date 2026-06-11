import { SearchField } from '@/components/primitive/SearchField'
import { Badge } from '@/components/primitive/Badge'
import { entityLabel, isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { ScpInfo } from '@/types/api'

interface ScpListPaneProps {
  scps: ScpInfo[]
  selectedId: number | null
  searchQuery: string
  loading: boolean
  error: boolean
  sioCountByScpId: Record<number, number>
  onSearch: (query: string) => void
  onSelect: (scp: ScpInfo) => void
}

export const ScpListPane = ({
  scps,
  selectedId,
  searchQuery,
  loading,
  error,
  sioCountByScpId,
  onSearch,
  onSelect,
}: ScpListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 260, borderRight: '0.5px solid var(--color-border)' }}
  >
    <div
      className="flex-shrink-0"
      style={{
        padding: '8px 12px 6px',
        background: 'var(--color-sidebar)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <p
        className="text-[13px] font-medium mb-1.5 tracking-wide"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        주제어기 (SCP)
      </p>
      <SearchField
        value={searchQuery}
        placeholder="명칭 검색..."
        onChange={onSearch}
      />
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
      ) : scps.length === 0 ? (
        <p className="text-[14px] text-center py-8 px-3" style={{ color: 'var(--color-text-subtle)' }}>
          {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 주제어기가 없습니다.'}
        </p>
      ) : (
        scps.map((scp) => {
          const isSelected = scp.id === selectedId
          const sioCount = sioCountByScpId[scp.id]
          const sioHint =
            sioCount === undefined
              ? undefined
              : sioCount === 0
                ? '부제어기 없음'
                : `부제어기 ${sioCount}개`

          return (
            <div
              key={scp.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(scp)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(scp)
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
              onMouseEnter={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--color-btn-hover)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = isSelected
                  ? 'var(--color-row-selected)'
                  : 'transparent'
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span
                    className="text-[14px] font-medium block truncate"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {entityLabel('scp', scp)}
                  </span>
                  <span
                    className="text-[13px] block mt-0.5 truncate"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    ID {scp.id}
                    {sioHint ? ` · ${sioHint}` : ''}
                  </span>
                </div>
                <Badge variant={isDeviceActive(scp.active) ? 'on' : 'off'}>
                  {isDeviceActive(scp.active) ? '활성' : '비활성'}
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
      전체 {scps.length}건
    </div>
  </div>
)
