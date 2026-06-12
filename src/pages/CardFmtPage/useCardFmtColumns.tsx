import { type ColumnDef } from '@/components/primitive/Grid'
import { fallbackCardFmtName } from '@/lib/entityDisplayLabels'
import type { CardfmtInfo } from '@/types/api'

export const useCardFmtColumns = (): ColumnDef<CardfmtInfo>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackCardFmtName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
  {
    key: 'totalBits',
    header: '비트',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? 0)}bit
      </span>
    ),
  },
  {
    key: 'minDigits',
    header: '자릿수',
    width: 88,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.minDigits}~{row.maxDigits}
      </span>
    ),
  },
]
