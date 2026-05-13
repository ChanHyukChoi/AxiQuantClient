import { Search } from 'lucide-react'

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
  searchPlaceholder = '검색',
  onSearch,
  totalCount,
  width = 240,
  loading = false,
}: ListPanelProps) => {
  const count = totalCount ?? items.length

  return (
    <>
      <style>{`
        .list-panel-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .list-panel-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .list-panel-scroll::-webkit-scrollbar-thumb {
          background: #2e3139;
          border-radius: 2px;
        }
        .list-panel-search::placeholder {
          color: #3a3f4a;
        }
      `}</style>

      <div
        className="flex flex-col flex-shrink-0 overflow-hidden"
        style={{
          width,
          borderRight: '0.5px solid #2a2d32',
        }}
      >
        {/* toolbar */}
        {onSearch && (
          <div
            className="flex items-center flex-shrink-0"
            style={{
              padding: '7px 12px',
              background: 'var(--color-sidebar)',
              borderBottom: '0.5px solid #2a2d32',
            }}
          >
            <div
              className="flex items-center gap-1.5 w-full px-2 py-1 rounded"
              style={{
                background: 'var(--color-btn-hover)',
                border: '0.5px solid #2e3139',
              }}
            >
              <Search style={{ width: 13, height: 13, color: '#3a3f4a', flexShrink: 0 }} />
              <input
                type="text"
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch(e.target.value)}
                className="list-panel-search flex-1 text-[12px] outline-none min-w-0"
                style={{
                  background: 'transparent',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          </div>
        )}

        {/* list */}
        <div className="flex-1 overflow-y-auto list-panel-scroll">
          {loading ? (
            <div
              className="flex items-center justify-center py-8 text-[12px]"
              style={{ color: '#555a63' }}
            >
              불러오는 중...
            </div>
          ) : (
            items.map((item) => {
              const isSelected = item.id === selectedId
              return (
                <ListPanelRow
                  key={item.id}
                  item={item}
                  isSelected={isSelected}
                  onItemClick={onItemClick}
                />
              )
            })
          )}
        </div>

        {/* footer */}
        <div
          className="flex-shrink-0 flex items-center text-[11px]"
          style={{
            padding: '5px 12px',
            background: 'var(--color-sidebar)',
            borderTop: '0.5px solid #2a2d32',
            color: '#3a3f4a',
          }}
        >
          전체 {count}건
        </div>
      </div>
    </>
  )
}

interface ListPanelRowProps {
  item: ListPanelItem
  isSelected: boolean
  onItemClick?: (item: ListPanelItem) => void
}

const ListPanelRow = ({ item, isSelected, onItemClick }: ListPanelRowProps) => {
  return (
    <div
      onClick={() => onItemClick?.(item)}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.background = 'var(--color-btn-hover)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLDivElement).style.background = 'transparent'
        }
      }}
      style={{
        background: isSelected ? '#172135' : 'transparent',
        borderBottom: '0.5px solid #21252b',
        borderRight: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
        cursor: onItemClick ? 'pointer' : 'default',
      }}
      className="flex items-center gap-2.5 px-3.5 py-2.5"
    >
      <span
        className="text-[11px] font-mono w-6 text-right flex-shrink-0"
        style={{ color: '#3a3f4a' }}
      >
        {item.id}
      </span>
      <div className="flex flex-col min-w-0">
        <span
          className="text-[12px] font-medium truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {item.label}
        </span>
        {item.subLabel && (
          <span className="text-[11px] mt-0.5 truncate" style={{ color: '#555a63' }}>
            {item.subLabel}
          </span>
        )}
      </div>
    </div>
  )
}
