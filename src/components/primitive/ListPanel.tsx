import { SearchField } from '@/components/primitive/SearchField'

export interface ListPanelItem {
  id: number
  label: string
  subLabel?: string
}

interface ListPanelProps {
  items: ListPanelItem[]
  selectedId?: number
  onItemClick?: (item: ListPanelItem) => void
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  totalCount?: number
  width?: number
  loading?: boolean
}

export const ListPanel = ({
  items,
  selectedId,
  onItemClick,
  searchPlaceholder = '검색...',
  onSearch,
  totalCount,
  width = 240,
  loading = false,
}: ListPanelProps) => {
  const count = totalCount ?? items.length

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{ width, borderRight: '0.5px solid var(--color-border)' }}
    >
      {/* toolbar */}
      {onSearch && (
        <div
          className="flex-shrink-0"
          style={{
            padding: '7px 12px',
            background: 'var(--color-sidebar)',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <SearchField placeholder={searchPlaceholder} onChange={onSearch} />
        </div>
      )}

      {/* list */}
      <div className="flex-1 overflow-y-auto app-scrollbar">
        {loading ? (
          <div
            className="flex items-center justify-center py-8 text-[14px]"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            불러오는 중...
          </div>
        ) : (
          items.map((item) => (
            <ListPanelRow
              key={item.id}
              item={item}
              isSelected={item.id === selectedId}
              onItemClick={onItemClick}
            />
          ))
        )}
      </div>

      {/* footer */}
      <div
        className="flex-shrink-0 flex items-center app-text-sm"
        style={{
          padding: '5px 12px',
          background: 'var(--color-sidebar)',
          borderTop: '0.5px solid var(--color-border)',
          color: 'var(--color-text-dim)',
        }}
      >
        전체 {count}건
      </div>
    </div>
  )
}

interface ListPanelRowProps {
  item: ListPanelItem
  isSelected: boolean
  onItemClick?: (item: ListPanelItem) => void
}

const ListPanelRow = ({ item, isSelected, onItemClick }: ListPanelRowProps) => (
  <div
    onClick={() => onItemClick?.(item)}
    onMouseEnter={(e) => {
      if (!isSelected)
        (e.currentTarget as HTMLDivElement).style.background = 'var(--color-btn-hover)'
    }}
    onMouseLeave={(e) => {
      if (!isSelected)
        (e.currentTarget as HTMLDivElement).style.background = 'transparent'
    }}
    style={{
      background: isSelected ? 'var(--color-row-selected)' : 'transparent',
      borderBottom: '0.5px solid var(--color-border-subtle)',
      borderRight: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
      cursor: onItemClick ? 'pointer' : 'default',
    }}
    className="flex items-center px-3.5 py-2.5"
  >
    <div className="flex flex-col min-w-0 flex-1">
      <span
        className="app-text-md font-medium truncate"
        style={{ color: 'var(--color-text)' }}
      >
        {item.label}
      </span>
      {item.subLabel && (
        <span
          className="app-text-sm mt-0.5 truncate"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          {item.subLabel}
        </span>
      )}
    </div>
  </div>
)
