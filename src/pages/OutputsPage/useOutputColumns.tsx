import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import type { OutputDisplayRow } from '@/pages/OutputsPage/outputDisplayTypes'
import {
  formatOutputAddr,
  formatSioName,
  outputLabel,
} from '@/pages/OutputsPage/utils/outputDisplay'

export const useOutputColumns = (): ColumnDef<OutputDisplayRow>[] => {
  const { t } = useTranslation(['common', 'device'])

  return useMemo(
    () => [
      {
        key: 'name',
        header: t('common:name'),
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
        header: t('device:grid.scp'),
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
        header: t('device:grid.sio'),
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
        header: t('common:address'),
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
        header: t('device:output.pulseDuration'),
        width: 88,
        align: 'center',
        sortable: true,
        render: (value) => (
          <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {String(value ?? 0)}
          </span>
        ),
      },
    ],
    [t],
  )
}
