import { type ColumnDef } from '@/components/primitive/Grid'
import { ActiveGridMark } from '@/components/basic/ActiveStatusBadge'
import { isAreaActive } from '@/pages/AreaPage/utils/areaHelpers'
import { fallbackAreaName } from '@/lib/entityDisplayLabels'
import type { AreaInfo } from '@/types/api'

export const useAreaColumns = (): ColumnDef<AreaInfo>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackAreaName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '상태',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => <ActiveGridMark active={isAreaActive(Number(value))} />,
  },
  {
    key: 'occup',
    header: '점유',
    width: 100,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.occup}/{row.occmax}
      </span>
    ),
  },
]
