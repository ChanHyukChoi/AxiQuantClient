import { SearchField } from '@/components/primitive/SearchField'
import { fallbackAccLvName } from '@/lib/entityDisplayLabels'
import type { AccLvInfo } from '@/types/api'

interface AccessListPaneProps {
  items: AccLvInfo[]
  selectedId: number | null
  searchQuery: string
  loading: boolean
  onSearch: (query: string) => void
  onSelect: (item: AccLvInfo) => void
}

export const AccessListPane = ({
  items,
  selectedId,
  searchQuery,
  loading,
  onSearch,
  onSelect,
}: AccessListPaneProps) => (
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
          placeholder="권한명 검색..."
          onChange={onSearch}
        />
      </div>
    </div>

    <div className="flex-1 overflow-y-auto app-scrollbar">
      {loading ? (
        <p
          className="text-[14px] text-center py-8"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          불러오는 중...
        </p>
      ) : items.length === 0 ? (
        <p
          className="text-[14px] text-center py-8"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 접근 권한이 없습니다.'}
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
              <span
                className="text-[14px] font-medium block truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {fallbackAccLvName(item.name)}
              </span>
            </div>
          )
        })
      )}
    </div>

    <div
      className="flex-shrink-0 flex items-center text-[13px]"
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
