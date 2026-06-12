import { type ColumnDef } from '@/components/primitive/Grid'
import type { HolidayInfo } from '@/types/api'

const holidayLabel = (item: HolidayInfo): string => item.name?.trim() || '휴일'

export const useHolidayColumns = (): ColumnDef<HolidayInfo>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {holidayLabel(row)}
      </span>
    ),
  },
  {
    key: 'date',
    header: '날짜',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '—')}
      </span>
    ),
  },
  {
    key: 'isRecurring',
    header: '매년',
    width: 64,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
]
