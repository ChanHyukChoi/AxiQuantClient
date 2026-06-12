import { type ColumnDef } from '@/components/primitive/Grid'
import {
  timezoneDisplayName,
  timezoneRangeLabel,
} from '@/pages/TimezoneHolidayPage/utils/timezoneDisplay'
import type { TimezoneInfo } from '@/types/api'

export const useTimezoneColumns = (): ColumnDef<TimezoneInfo>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {timezoneDisplayName(row)}
      </span>
    ),
  },
  {
    key: 'startTime',
    header: '시작',
    width: 80,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.startTime ?? row.intervals[0]?.stm ?? '—'}
      </span>
    ),
  },
  {
    key: 'endTime',
    header: '종료',
    width: 80,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.endTime ?? row.intervals[0]?.etm ?? '—'}
      </span>
    ),
  },
  {
    key: 'intervals',
    header: '구간',
    width: 64,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.intervals.length}
      </span>
    ),
  },
  {
    key: 'id',
    header: '범위',
    width: 140,
    sortable: false,
    render: (_, row) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-subtle)' }}>
        {timezoneRangeLabel(row)}
      </span>
    ),
  },
]
