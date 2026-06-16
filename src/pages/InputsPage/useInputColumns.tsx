import { type ColumnDef } from '@/components/primitive/Grid'
import { isDeviceActive } from '@/lib/device/deviceHelpers'
import type { InputDisplayRow } from '@/pages/InputsPage/inputDisplayTypes'
import {
  formatInputAddr,
  formatInputMode,
  formatSioName,
  inputLabel,
} from '@/pages/InputsPage/utils/inputDisplay'

export const useInputColumns = (): ColumnDef<InputDisplayRow>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {inputLabel(row)}
      </span>
    ),
  },
  {
    key: 'active',
    header: '?�성',
    width: 64,
    align: 'center',
    sortable: true,
    render: (value) =>
      isDeviceActive(Number(value)) ? (
        <span style={{ color: 'var(--color-accent)' }}>??/span>
      ) : null,
  },
  {
    key: 'scpName',
    header: '주제?�기',
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
    header: '부?�어�?,
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
    header: '?�드?�스',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {formatInputAddr(Number(value))}
      </span>
    ),
  },
  {
    key: 'mode',
    header: '모드',
    width: 140,
    sortable: true,
    render: (value) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {formatInputMode(Number(value))}
      </span>
    ),
  },
]
