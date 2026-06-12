import { type ColumnDef } from '@/components/primitive/Grid'
import { fallbackAccLvName } from '@/lib/entityDisplayLabels'
import type { AccLvInfo } from '@/types/api'

export const useAccLvColumns = (): ColumnDef<AccLvInfo>[] => [
  {
    key: 'name',
    header: '권한명',
    width: 200,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackAccLvName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
  {
    key: 'description',
    header: '설명',
    sortable: true,
    render: (value) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {typeof value === 'string' && value.trim() ? value : '—'}
      </span>
    ),
  },
]
