import { Search } from 'lucide-react'

export interface ColumnDef<T> {
  key: string
  header: string
  width?: number
  render?: (value: unknown, row: T) => React.ReactNode
}

interface GridProps<T extends { id: number }> {
  columns: ColumnDef<T>[]
  data: T[]
  selectedId?: number
  onRowClick?: (row: T) => void
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  actions?: React.ReactNode
  totalCount?: number
  loading?: boolean
}

export const Grid = <T extends { id: number }>({
  columns,
  data,
  selectedId,
  onRowClick,
  searchPlaceholder = '검색',
  onSearch,
  actions,
  totalCount,
  loading = false,
}: GridProps<T>) => {
  const count = totalCount ?? data.length

  return (
    <>
      <style>{`
        .grid-scroll::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .grid-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .grid-scroll::-webkit-scrollbar-thumb {
          background: #2e3139;
          border-radius: 2px;
        }
        .grid-search-input::placeholder {
          color: #3a3f4a;
        }
      `}</style>

      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        {/* toolbar */}
        <div
          className="flex items-center gap-2 flex-shrink-0"
          style={{
            padding: '7px 12px',
            background: 'var(--color-sidebar)',
            borderBottom: '0.5px solid #2a2d32',
          }}
        >
          {onSearch && (
            <div
              className="flex items-center gap-1.5 flex-1 max-w-[260px] px-2 py-1 rounded"
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
                className="grid-search-input flex-1 text-[12px] outline-none min-w-0"
                style={{
                  background: 'transparent',
                  color: 'var(--color-text)',
                }}
              />
            </div>
          )}
          {actions && <div className="flex items-center gap-1.5 ml-auto">{actions}</div>}
        </div>

        {/* table */}
        <div className="flex-1 overflow-auto grid-scroll">
          <table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-sidebar)' }}>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    style={{
                      width: col.width ? col.width : undefined,
                      padding: '6px 10px',
                      textAlign: 'left',
                      fontSize: 11,
                      fontWeight: 500,
                      color: '#3a3f4a',
                      borderBottom: '0.5px solid #2a2d32',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="text-center py-8 text-[12px]"
                    style={{ color: '#555a63' }}
                  >
                    불러오는 중...
                  </td>
                </tr>
              ) : (
                data.map((row) => {
                  const isSelected = row.id === selectedId
                  return (
                    <GridRow
                      key={row.id}
                      row={row}
                      columns={columns}
                      isSelected={isSelected}
                      onRowClick={onRowClick}
                    />
                  )
                })
              )}
            </tbody>
          </table>
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

interface GridRowProps<T extends { id: number }> {
  row: T
  columns: ColumnDef<T>[]
  isSelected: boolean
  onRowClick?: (row: T) => void
}

const GridRow = <T extends { id: number }>({
  row,
  columns,
  isSelected,
  onRowClick,
}: GridRowProps<T>) => {
  return (
    <tr
      onClick={() => onRowClick?.(row)}
      style={{
        background: isSelected ? '#172135' : 'var(--color-bg)',
        cursor: onRowClick ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-btn-hover)'
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          (e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-bg)'
        }
      }}
    >
      {columns.map((col) => {
        const rawValue = (row as Record<string, unknown>)[col.key]
        const cell = col.render ? col.render(rawValue, row) : String(rawValue ?? '')
        return (
          <td
            key={col.key}
            style={{
              padding: '6px 10px',
              fontSize: 12,
              color: '#8a8f9a',
              borderBottom: '0.5px solid #21252b',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {cell}
          </td>
        )
      })}
    </tr>
  )
}
