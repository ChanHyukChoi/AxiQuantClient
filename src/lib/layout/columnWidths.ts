import type { ColumnDef } from '@/components/primitive/Grid'

/** 컬럼 width 합 + 툴바/스크롤 여유 — Grid 최소 표시 폭 추정 */
export const sumColumnWidths = <T>(
  columns: ColumnDef<T>[],
  extra = 48,
  fallbackPerCol = 80,
): number =>
  columns.reduce((acc, col) => acc + (col.width ?? fallbackPerCol), 0) + extra
