import { SearchField } from '@/components/primitive/SearchField'

export interface ColumnDef<T> {
  key: string
  header: string
  width?: number
  align?: 'left' | 'center' | 'right'
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
  onSearch,
  actions,
  totalCount,
  loading = false,
}: GridProps<T>) => {
  const count = totalCount ?? data.length

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
      {/* toolbar */}
      <div
        className="flex items-center gap-2 flex-shrink-0"
        style={{
          padding: '7px 12px',
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        {onSearch && <SearchField onChange={onSearch} />}
        {actions && <div className="flex items-center gap-1.5 ml-auto">{actions}</div>}
      </div>

      {/* table */}
      <div className="flex-1 overflow-auto app-scrollbar">
        <table
          style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}
        >
          <thead
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              background: 'var(--color-sidebar)',
            }}
          >
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    width: col.width ?? undefined,
                    padding: '6px 10px',
                    textAlign: col.align ?? 'left',
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: 'var(--color-text-dim)',
                    borderBottom: '0.5px solid var(--color-border)',
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
                  className="text-center py-8"
                  style={{ color: 'var(--color-text-subtle)', fontSize: 15 }}
                >
                  불러오는 중...
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <GridRow
                  key={row.id}
                  row={row}
                  columns={columns}
                  isSelected={row.id === selectedId}
                  onRowClick={onRowClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* footer */}
      <div
        className="flex-shrink-0 flex items-center"
        style={{
          padding: '5px 12px',
          background: 'var(--color-sidebar)',
          borderTop: '0.5px solid var(--color-border)',
          color: 'var(--color-text-cell)',
          fontSize: 15,
        }}
      >
        전체 {count}건
      </div>
    </div>
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
}: GridRowProps<T>) => (
  <tr
    onClick={() => onRowClick?.(row)}
    style={{
      background: isSelected ? 'var(--color-row-selected)' : 'var(--color-bg)',
      cursor: onRowClick ? 'pointer' : 'default',
    }}
    onMouseEnter={(e) => {
      if (!isSelected)
        (e.currentTarget as HTMLTableRowElement).style.background =
          'var(--color-btn-hover)'
    }}
    onMouseLeave={(e) => {
      if (!isSelected)
        (e.currentTarget as HTMLTableRowElement).style.background = 'var(--color-bg)'
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
            fontSize: 15,
            color: 'var(--color-cell)',
            borderBottom: '0.5px solid var(--color-border-subtle)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: col.align ?? 'left',
          }}
        >
          {cell}
        </td>
      )
    })}
  </tr>
)
