import type { ColumnDef } from '@/components/primitive/Grid'
import { ActiveGridMark } from '@/components/basic/ActiveStatusBadge'
import { entityLabel, isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'
import type { SioInfo } from '@/types/api'

export const BASE_SIO_GRID_COLUMNS: ColumnDef<SioInfo>[] = [
  {
    key: 'port',
    header: '포트',
    width: 80,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {Number(value) > 0 ? `PORT ${value}` : '—'}
      </span>
    ),
  },
  {
    key: 'name',
    header: '명칭',
    width: 140,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {entityLabel('sio', row)}
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
  {
    key: 'addr',
    header: '어드레스',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '상태',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => <ActiveGridMark active={isDeviceActive(Number(value))} />,
  },
]
