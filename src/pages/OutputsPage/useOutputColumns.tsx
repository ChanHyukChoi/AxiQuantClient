import { type ColumnDef } from '@/components/primitive/Grid'
import type { OutputDisplayRow } from '@/pages/OutputsPage/outputDisplayTypes'
import {
  formatOutputAddr,
  formatSioName,
  outputLabel,
} from '@/pages/OutputsPage/utils/outputDisplay'

export const useOutputColumns = (): ColumnDef<OutputDisplayRow>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {outputLabel(row)}
      </span>
    ),
  },
  {
    key: 'scpName',
    header: '주제어기',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'sioName',
    header: '부제어기',
    width: 100,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {formatSioName(row.sio, row.sioName)}
      </span>
    ),
  },
  {
    key: 'addr',
    header: '어드레스',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {formatOutputAddr(Number(value))}
      </span>
    ),
  },
  {
    key: 'defpulse',
    header: '지속 시간',
    width: 88,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? 0)}
      </span>
    ),
  },
]
