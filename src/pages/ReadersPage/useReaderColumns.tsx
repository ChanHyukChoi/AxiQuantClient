import { type ColumnDef } from '@/components/primitive/Grid'
import { isDeviceActive } from '@/lib/device/deviceHelpers'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readerDisplayTypes'
import {
  formatDefMode,
  formatReaderAddr,
  formatSioName,
  readerLabel,
} from '@/pages/ReadersPage/utils/readerDisplay'

export const useReaderColumns = (): ColumnDef<ReaderDisplayRow>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (_, row) => (
      <span
        className="text-[14px] truncate block"
        style={{ color: isDeviceActive(row.active) ? 'var(--color-text)' : 'var(--color-text-dim)' }}
      >
        {readerLabel(row)}
      </span>
    ),
  },
  {
    key: 'scpName',
    header: '주제?�기',
    width: 110,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'sioName',
    header: '부?�어�?,
    width: 88,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {formatSioName(row.sio, row.sioName)}
      </span>
    ),
  },
  {
    key: 'addr',
    header: '?�드?�스',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {formatReaderAddr(Number(value))}
      </span>
    ),
  },
  {
    key: 'modelName',
    header: '모띸',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'defmode',
    header: '기본모드',
    width: 100,
    sortable: true,
    render: (value) => (
      <span className="text-[12px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {formatDefMode(Number(value))}
      </span>
    ),
  },
]
