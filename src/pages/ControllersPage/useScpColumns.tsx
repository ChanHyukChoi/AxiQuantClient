import { type ColumnDef } from '@/components/primitive/Grid'
import { ActiveGridMark } from '@/components/basic/ActiveStatusBadge'
import {
  entityLabel,
  isDeviceActive,
} from '@/lib/device/deviceHelpers'
import type { ScpInfo } from '@/types/api'

export const useScpColumns = (): ColumnDef<ScpInfo>[] => [
  {
    key: 'id',
    header: 'ID',
    width: 56,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {entityLabel('scp', row)}
      </span>
    ),
  },
  {
    key: 'active',
    header: '?�태',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => <ActiveGridMark active={isDeviceActive(Number(value))} />,
  },
  {
    key: 'connstr',
    header: '?�결',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {typeof value === 'string' && value.trim() ? value : '??}
      </span>
    ),
  },
  {
    key: 'model',
    header: '모델',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
]
