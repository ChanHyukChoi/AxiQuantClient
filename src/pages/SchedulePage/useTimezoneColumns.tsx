import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import {
  timezoneDisplayName,
  timezoneRangeLabel,
} from '@/pages/SchedulePage/utils/timezoneDisplay'
import type { TimezoneInfo } from '@/types/api'

export const useTimezoneColumns = (): ColumnDef<TimezoneInfo>[] => {
  const { t } = useTranslation(['schedule', 'common'])

  return useMemo(
    () => [
      {
        key: 'name',
        header: t('common:name'),
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
        header: t('schedule:column.start'),
        width: 80,
        align: 'center',
        sortable: true,
        render: (_, row) => (
          <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {row.startTime ?? row.intervals[0]?.stm ?? t('common:empty')}
          </span>
        ),
      },
      {
        key: 'endTime',
        header: t('schedule:column.end'),
        width: 80,
        align: 'center',
        sortable: true,
        render: (_, row) => (
          <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {row.endTime ?? row.intervals[0]?.etm ?? t('common:empty')}
          </span>
        ),
      },
      {
        key: 'intervals',
        header: t('schedule:column.interval'),
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
        header: t('schedule:column.range'),
        width: 140,
        sortable: false,
        render: (_, row) => (
          <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-subtle)' }}>
            {timezoneRangeLabel(row)}
          </span>
        ),
      },
    ],
    [t],
  )
}
