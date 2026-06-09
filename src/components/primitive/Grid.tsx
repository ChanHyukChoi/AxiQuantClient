import { useCallback, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { SearchField } from '@/components/primitive/SearchField'

export type SortDirection = 'asc' | 'desc'

const GRID_COL_DRAG_TYPE = 'application/x-axiquant-grid-col'

export interface ColumnDef<T> {
  key: string
  header: string
  width?: number
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  resizable?: boolean
  /** false면 컬럼 숨기기 불가 (기본 true) */
  hideable?: boolean
  /** false면 헤더 드래그 순서 변경 불가 (기본 true) */
  reorderable?: boolean
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
  resizableColumns?: boolean
  onColumnWidthChange?: (key: string, width: number) => void
  minColumnWidth?: number
  reorderableColumns?: boolean
  onColumnReorder?: (fromKey: string, toKey: string) => void
}

interface SortState {
  key: string
  direction: SortDirection
}

const DEFAULT_COL_WIDTH = 80
const DEFAULT_MIN_COL_WIDTH = 48
/** 컬럼 경계 중심 히트 영역 (인접 th에 가려지지 않도록 양쪽으로 걸침) */
const COL_RESIZE_HIT_WIDTH = 18

/** 기본 드래그 이미지 숨김 (커스텀 고스트 사용) */
const TRANSPARENT_DRAG_IMAGE: HTMLImageElement | null =
  typeof Image !== 'undefined'
    ? (() => {
        const img = new Image()
        img.src =
          'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
        return img
      })()
    : null

const compareCellValues = (a: unknown, b: unknown, direction: SortDirection): number => {
  const mul = direction === 'asc' ? 1 : -1
  if (a == null && b == null) return 0
  if (a == null) return -1 * mul
  if (b == null) return 1 * mul
  if (typeof a === 'number' && typeof b === 'number') return (a - b) * mul
  if (typeof a === 'boolean' && typeof b === 'boolean') {
    return (Number(a) - Number(b)) * mul
  }
  return String(a).localeCompare(String(b), 'ko', { numeric: true }) * mul
}

const colWidth = <T,>(col: ColumnDef<T>) => col.width ?? DEFAULT_COL_WIDTH

const isColResizable = <T,>(
  col: ColumnDef<T>,
  resizableColumns: boolean | undefined,
): boolean => {
  if (!resizableColumns) return false
  if (col.resizable === false) return false
  return true
}

const isColReorderable = <T,>(
  col: ColumnDef<T>,
  reorderableColumns: boolean | undefined,
): boolean => {
  if (!reorderableColumns) return false
  if (col.reorderable === false) return false
  return true
}

const CELL_PAD_Y = 6
const CELL_PAD_X = 10

const cellJustifyContent = (
  align: ColumnDef<unknown>['align'],
): React.CSSProperties['justifyContent'] => {
  if (align === 'center') return 'center'
  if (align === 'right') return 'flex-end'
  return 'flex-start'
}

const GridCellAlign = ({
  align,
  children,
  truncate,
}: {
  align?: ColumnDef<unknown>['align']
  children: React.ReactNode
  truncate?: boolean
}) => (
  <div
    className="app-grid-cell"
    style={{ justifyContent: cellJustifyContent(align) }}
  >
    {truncate ? (
      <span className="min-w-0 truncate">{children}</span>
    ) : (
      children
    )}
  </div>
)

export const Grid = <T extends { id: number }>({
  columns,
  data,
  selectedId,
  onRowClick,
  onSearch,
  actions,
  totalCount,
  loading = false,
  resizableColumns = false,
  onColumnWidthChange,
  minColumnWidth = DEFAULT_MIN_COL_WIDTH,
  reorderableColumns = false,
  onColumnReorder,
}: GridProps<T>) => {
  const [sort, setSort] = useState<SortState | null>(null)
  const [draggingKey, setDraggingKey] = useState<string | null>(null)
  const [dragOverKey, setDragOverKey] = useState<string | null>(null)
  const dragGhostRef = useRef<HTMLDivElement | null>(null)
  const draggingKeyRef = useRef<string | null>(null)
  const dragOverKeyRef = useRef<string | null>(null)
  const dragCommittedRef = useRef(false)
  const suppressHeaderClickRef = useRef(false)
  const blockColumnDragRef = useRef(false)
  const [resizeHoverKey, setResizeHoverKey] = useState<string | null>(null)
  const [resizeActiveKey, setResizeActiveKey] = useState<string | null>(null)
  const count = totalCount ?? data.length
  const isColumnDragging = draggingKey != null
  const tableWidth = useMemo(
    () => columns.reduce((sum, col) => sum + colWidth(col), 0),
    [columns],
  )

  const sortedData = useMemo(() => {
    if (!sort) return data
    const { key, direction } = sort
    return [...data].sort((a, b) => {
      const av = (a as Record<string, unknown>)[key]
      const bv = (b as Record<string, unknown>)[key]
      return compareCellValues(av, bv, direction)
    })
  }, [data, sort])

  const handleHeaderClick = (col: ColumnDef<T>) => {
    if (suppressHeaderClickRef.current) {
      suppressHeaderClickRef.current = false
      return
    }
    if (!col.sortable) return
    setSort((prev) => {
      if (prev?.key !== col.key) return { key: col.key, direction: 'asc' }
      if (prev.direction === 'asc') return { key: col.key, direction: 'desc' }
      return null
    })
  }

  const handleColumnResizeStart = (col: ColumnDef<T>, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const handle = e.currentTarget
    handle.setPointerCapture(e.pointerId)
    blockColumnDragRef.current = true
    suppressHeaderClickRef.current = true
    setResizeActiveKey(col.key)

    const startX = e.clientX
    const startWidth = colWidth(col)

    const onMove = (ev: PointerEvent) => {
      const next = Math.max(minColumnWidth, startWidth + (ev.clientX - startX))
      onColumnWidthChange?.(col.key, next)
    }

    const onEnd = (ev: PointerEvent) => {
      if (handle.hasPointerCapture(ev.pointerId)) {
        handle.releasePointerCapture(ev.pointerId)
      }
      document.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerup', onEnd)
      document.removeEventListener('pointercancel', onEnd)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      blockColumnDragRef.current = false
      setResizeActiveKey(null)
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('pointermove', onMove)
    document.addEventListener('pointerup', onEnd)
    document.addEventListener('pointercancel', onEnd)
  }

  const commitColumnReorder = useCallback(() => {
    if (dragCommittedRef.current || !onColumnReorder) return
    const from = draggingKeyRef.current
    const to = dragOverKeyRef.current
    if (!from || !to || from === to) return
    dragCommittedRef.current = true
    onColumnReorder(from, to)
  }, [onColumnReorder])

  const cleanupColumnDrag = useCallback(() => {
    setDraggingKey(null)
    setDragOverKey(null)
    draggingKeyRef.current = null
    dragOverKeyRef.current = null
    dragCommittedRef.current = false
    document.body.classList.remove('grid-col-drag-active')
    const ghost = dragGhostRef.current
    if (ghost?.parentNode) ghost.parentNode.removeChild(ghost)
    dragGhostRef.current = null
  }, [])

  const setDragOver = useCallback((key: string) => {
    dragOverKeyRef.current = key
    setDragOverKey((prev) => (prev === key ? prev : key))
  }, [])

  const isResizeDragTarget = (target: EventTarget | null) =>
    target instanceof Element && target.closest('[data-col-resize]') != null

  const handleDragStart = (col: ColumnDef<T>, e: React.DragEvent<HTMLTableCellElement>) => {
    if (blockColumnDragRef.current || isResizeDragTarget(e.target)) {
      e.preventDefault()
      return
    }
    if (!reorderableColumns || !onColumnReorder) return
    suppressHeaderClickRef.current = true
    e.stopPropagation()
    e.dataTransfer.setData(GRID_COL_DRAG_TYPE, col.key)
    e.dataTransfer.effectAllowed = 'move'
    if (TRANSPARENT_DRAG_IMAGE) {
      e.dataTransfer.setDragImage(TRANSPARENT_DRAG_IMAGE, 0, 0)
    }

    dragCommittedRef.current = false
    draggingKeyRef.current = col.key
    dragOverKeyRef.current = col.key
    setDraggingKey(col.key)
    setDragOverKey(col.key)
    document.body.classList.add('grid-col-drag-active')

    const ghost = document.createElement('div')
    ghost.className = 'grid-col-drag-ghost'
    ghost.textContent = col.header
    document.body.appendChild(ghost)
    dragGhostRef.current = ghost

    const moveGhost = (clientX: number, clientY: number) => {
      ghost.style.transform = `translate(${clientX + 12}px, ${clientY + 10}px)`
    }
    moveGhost(e.clientX, e.clientY)

    const onDrag = (ev: DragEvent) => {
      if (ev.clientX === 0 && ev.clientY === 0) return
      moveGhost(ev.clientX, ev.clientY)
    }

    const onDragEnd = () => {
      document.removeEventListener('drag', onDrag)
      document.removeEventListener('dragend', onDragEnd)
      commitColumnReorder()
      cleanupColumnDrag()
    }

    document.addEventListener('drag', onDrag)
    document.addEventListener('dragend', onDragEnd)
  }

  const handleDragOver = (col: ColumnDef<T>, e: React.DragEvent<HTMLTableCellElement>) => {
    if (!reorderableColumns || !onColumnReorder || !draggingKeyRef.current) return
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(col.key)
  }

  const handleDrop = (col: ColumnDef<T>, e: React.DragEvent<HTMLTableCellElement>) => {
    if (!reorderableColumns || !onColumnReorder) return
    e.preventDefault()
    e.stopPropagation()
    setDragOver(col.key)
    commitColumnReorder()
    cleanupColumnDrag()
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-w-0">
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

      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-auto app-scrollbar">
        <table
          className={isColumnDragging ? 'app-grid app-grid--col-dragging' : 'app-grid'}
          style={{
            tableLayout: 'fixed',
            width: `max(100%, ${tableWidth}px)`,
            borderCollapse: 'collapse',
          }}
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
              {columns.map((col, colIndex) => {
                const isActive = sort?.key === col.key
                const direction = isActive ? sort.direction : null
                const width = colWidth(col)
                const isLastColumn = colIndex === columns.length - 1
                const canResize = isColResizable(col, resizableColumns)
                const canReorder = isColReorderable(col, reorderableColumns)
                const isDropTarget =
                  isColumnDragging && dragOverKey === col.key && draggingKey !== col.key
                const isDragSource = draggingKey === col.key

                const isResizeRaised =
                  resizeHoverKey === col.key || resizeActiveKey === col.key
                const headerDraggable =
                  canReorder &&
                  !!onColumnReorder &&
                  resizeActiveKey !== col.key &&
                  resizeHoverKey !== col.key

                return (
                  <th
                    key={col.key}
                    draggable={headerDraggable}
                    data-col-drag-source={isDragSource ? 'true' : undefined}
                    data-col-drop-target={isDropTarget ? 'true' : undefined}
                    onClick={() => handleHeaderClick(col)}
                    onDragStart={(e) => handleDragStart(col, e)}
                    onDragOver={(e) => handleDragOver(col, e)}
                    onDrop={(e) => handleDrop(col, e)}
                    style={{
                      width,
                      minWidth: width,
                      maxWidth: width,
                      padding: `${CELL_PAD_Y}px ${CELL_PAD_X}px`,
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'var(--color-text-dim)',
                      borderBottom: '0.5px solid var(--color-border)',
                      whiteSpace: 'nowrap',
                      cursor: isResizeRaised
                        ? 'col-resize'
                        : headerDraggable
                          ? 'grab'
                          : col.sortable
                            ? 'pointer'
                            : 'default',
                      userSelect: 'none',
                      position: 'relative',
                      overflow: canResize ? 'visible' : 'hidden',
                      zIndex: isResizeRaised ? 20 : undefined,
                    }}
                    aria-sort={
                      col.sortable && isActive
                        ? direction === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : undefined
                    }
                  >
                    <GridCellAlign align={col.align} truncate>
                      {col.header}
                    </GridCellAlign>
                    {col.sortable ? (
                      <span
                        className="inline-flex flex-col pointer-events-none"
                        style={{
                          position: 'absolute',
                          right: CELL_PAD_X,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          opacity: isActive ? 1 : 0.35,
                          color: isActive ? 'var(--color-accent)' : 'var(--color-text-dim)',
                        }}
                      >
                        <ChevronUp
                          size={10}
                          strokeWidth={2.5}
                          style={{
                            marginBottom: -3,
                            opacity: direction === 'asc' ? 1 : 0.35,
                          }}
                        />
                        <ChevronDown
                          size={10}
                          strokeWidth={2.5}
                          style={{
                            opacity: direction === 'desc' ? 1 : 0.35,
                          }}
                        />
                      </span>
                    ) : null}
                    {canResize && onColumnWidthChange && (
                      <div
                        data-col-resize
                        role="separator"
                        aria-orientation="vertical"
                        aria-label={`${col.header} 너비 조절`}
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onMouseDown={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                        }}
                        onPointerDown={(e) => {
                          e.stopPropagation()
                          handleColumnResizeStart(col, e)
                        }}
                        onPointerEnter={() => setResizeHoverKey(col.key)}
                        onPointerLeave={() => {
                          if (resizeActiveKey !== col.key) setResizeHoverKey(null)
                        }}
                        className="app-grid-col-resize absolute top-0 touch-none"
                        style={{
                          right: isLastColumn ? 0 : -COL_RESIZE_HIT_WIDTH / 2,
                          width: COL_RESIZE_HIT_WIDTH,
                          height: '100%',
                          cursor: 'col-resize',
                          zIndex: 2,
                        }}
                      />
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="text-center py-8"
                  style={{ color: 'var(--color-text-subtle)', fontSize: 15 }}
                >
                  불러오는 중...
                </td>
              </tr>
            ) : columns.length === 0 ? (
              <tr>
                <td
                  colSpan={1}
                  className="text-center py-8"
                  style={{ color: 'var(--color-text-subtle)', fontSize: 15 }}
                >
                  표시할 컬럼이 없습니다. 목록 옵션에서 컬럼을 선택하세요.
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
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
      const width = colWidth(col)
      return (
        <td
          key={col.key}
          style={{
            width,
            minWidth: width,
            maxWidth: width,
            padding: `${CELL_PAD_Y}px ${CELL_PAD_X}px`,
            fontSize: 15,
            color: 'var(--color-cell)',
            borderBottom: '0.5px solid var(--color-border-subtle)',
            overflow: 'hidden',
          }}
        >
          <GridCellAlign align={col.align}>{cell}</GridCellAlign>
        </td>
      )
    })}
  </tr>
)
