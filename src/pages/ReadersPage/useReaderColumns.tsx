import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import { isDeviceActive } from '@/lib/device/deviceHelpers'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readerDisplayTypes'
import {
  formatDefMode,
  formatReaderAddr,
  formatSioName,
  readerLabel,
} from '@/pages/ReadersPage/utils/readerDisplay'

export const useReaderColumns = (): ColumnDef<ReaderDisplayRow>[] => {
  const { t } = useTranslation(['common', 'device', 'reader'])

  return useMemo(
    () => [
      {
        key: 'name',
        header: t('common:name'),
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
        header: t('device:grid.scp'),
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
        header: t('device:grid.sio'),
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
        header: t('common:address'),
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
        header: t('common:model'),
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
        header: t('reader:grid.defaultMode'),
        width: 100,
        sortable: true,
        render: (value) => (
          <span className="text-[12px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
            {formatDefMode(Number(value))}
          </span>
        ),
      },
    ],
    [t],
  )
}
