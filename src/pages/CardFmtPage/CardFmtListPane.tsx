import { SearchField } from '@/components/primitive/SearchField'
import { fallbackCardFmtName } from '@/lib/entityDisplayLabels'
import type { CardfmtInfo } from '@/types/api'

interface CardFmtListPaneProps {
  items: CardfmtInfo[]
  selectedId: number | null
  searchQuery: string
  loading: boolean
  error: boolean
  onSearch: (query: string) => void
  onSelect: (item: CardfmtInfo) => void
}

export const CardFmtListPane = ({
  items,
  selectedId,
  searchQuery,
  loading,
  error,
  onSearch,
  onSelect,
}: CardFmtListPaneProps) => (
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
          placeholder="형식명 검색..."
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
          카드 형식 목록을 불러오지 못했습니다.
        </p>
      ) : items.length === 0 ? (
        <p
          className="text-[12px] text-center py-8"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 형식이 없습니다.'}
        </p>
      ) : (
        items.map((item) => {
          const isSelected = item.id === selectedId
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(item)
                }
              }}
              className="px-3 py-2.5 cursor-pointer"
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
              <span
                className="text-[12px] font-medium block truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {fallbackCardFmtName(item.name)}
              </span>
              <span
                className="text-[11px] mt-0.5 block"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                {item.totalBits}bit · WIEGAND
              </span>
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
      전체 {items.length}건
    </div>
  </div>
)
