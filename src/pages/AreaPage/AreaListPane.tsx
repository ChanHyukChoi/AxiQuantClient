import { SearchField } from '@/components/primitive/SearchField'
import { Badge } from '@/components/primitive/Badge'
import { fallbackAreaName } from '@/lib/entityDisplayLabels'
import {
  isAreaActive,
  occupancyPercent,
  occupancyRatio,
} from '@/pages/AreaPage/utils/areaHelpers'
import type { AreaInfo } from '@/types/api'

interface AreaListPaneProps {
  areas: AreaInfo[]
  selectedId: number | null
  searchQuery: string
  loading: boolean
  error: boolean
  onSearch: (query: string) => void
  onSelect: (area: AreaInfo) => void
}

export const AreaListPane = ({
  areas,
  selectedId,
  searchQuery,
  loading,
  error,
  onSearch,
  onSelect,
}: AreaListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 240, borderRight: '0.5px solid var(--color-border)' }}
  >
    <div
      className="flex items-center flex-shrink-0 min-w-0 w-full"
      style={{
        padding: '7px 12px',
        background: 'var(--color-sidebar)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <div className="w-full min-w-0">
        <SearchField
          value={searchQuery}
          placeholder="영역명 검색..."
          onChange={onSearch}
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto app-scrollbar">
      {loading ? (
        <p
          className="text-[12px] text-center py-8"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          불러오는 중...
        </p>
      ) : error ? (
        <p className="text-[12px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
          영역 목록을 불러오지 못했습니다.
        </p>
      ) : areas.length === 0 ? (
        <p
          className="text-[12px] text-center py-8"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 영역이 없습니다.'}
        </p>
      ) : (
        areas.map((area) => {
          const isSelected = area.id === selectedId
          const ratio = occupancyRatio(area.occup, area.occmax)
          const pct = occupancyPercent(area.occup, area.occmax)

          return (
            <div
              key={area.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(area)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(area)
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
                  (e.currentTarget as HTMLDivElement).style.background =
                    'var(--color-btn-hover)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = isSelected
                  ? 'var(--color-row-selected)'
                  : 'transparent'
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[12px] font-medium truncate flex-1 min-w-0"
                  style={{ color: 'var(--color-text)' }}
                >
                  {fallbackAreaName(area.name)}
                </span>
                <Badge variant={isAreaActive(area.active) ? 'on' : 'off'}>
                  {isAreaActive(area.active) ? '활성' : '비활성'}
                </Badge>
              </div>

              <p
                className="text-[11px] mt-1"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                {area.occup} / {area.occmax} ({pct}%)
              </p>

              <div
                className="mt-1.5 rounded-full overflow-hidden"
                style={{ height: 3, background: 'var(--color-border)' }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${ratio * 100}%`,
                    background: 'var(--color-accent)',
                    transition: 'width 200ms ease',
                  }}
                />
              </div>
            </div>
          )
        })
      )}
    </div>

    <div
      className="flex-shrink-0 flex items-center text-[11px]"
      style={{
        padding: '5px 12px',
        background: 'var(--color-sidebar)',
        borderTop: '0.5px solid var(--color-border)',
        color: 'var(--color-text-dim)',
      }}
    >
      전체 {areas.length}건
    </div>
  </div>
)
