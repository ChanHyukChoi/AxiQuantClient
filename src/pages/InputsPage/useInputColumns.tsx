import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import { isDeviceActive } from '@/lib/device/deviceHelpers'
import type { InputDisplayRow } from '@/pages/InputsPage/inputDisplayTypes'
import {
  formatInputAddr,
  formatInputMode,
  formatSioName,
  inputLabel,
} from '@/pages/InputsPage/utils/inputDisplay'

export const useInputColumns = (): ColumnDef<InputDisplayRow>[] => {
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
            {inputLabel(row)}
          </span>
        ),
      },
      {
        key: 'active',
        header: t('common:active'),
        width: 64,
        align: 'center',
        sortable: true,
        render: (value) =>
          isDeviceActive(Number(value)) ? (
            <span style={{ color: 'var(--color-accent)' }}>?</span>
          ) : null,
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
            {formatInputAddr(Number(value))}
          </span>
        ),
      },
      {
        key: 'mode',
        header: t('common:mode'),
        width: 140,
        sortable: true,
        render: (value) => (
          <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
            {formatInputMode(Number(value))}
          </span>
        ),
      },
    ],
    [t],
  )
}
