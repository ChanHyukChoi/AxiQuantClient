import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import { ActiveGridMark } from '@/components/basic/ActiveStatusBadge'
import {
  entityLabel,
  isDeviceActive,
} from '@/lib/device/deviceHelpers'
import type { ScpInfo } from '@/types/api'

export const useScpColumns = (): ColumnDef<ScpInfo>[] => {
  const { t } = useTranslation(['common', 'device'])

  return useMemo(
    () => [
      {
        key: 'id',
        header: t('common:id'),
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
        header: t('common:name'),
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
        header: t('common:status'),
        width: 80,
        align: 'center',
        sortable: true,
        render: (value) => <ActiveGridMark active={isDeviceActive(Number(value))} />,
      },
      {
        key: 'connstr',
        header: t('common:connection'),
        width: 180,
        sortable: true,
        render: (value) => (
          <span className="text-[14px] font-mono truncate block" style={{ color: 'var(--color-text-muted)' }}>
            {typeof value === 'string' && value.trim() ? value : t('common:empty')}
          </span>
        ),
      },
      {
        key: 'model',
        header: t('common:model'),
        width: 72,
        align: 'center',
        sortable: true,
        render: (value) => (
          <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {String(value ?? '')}
          </span>
        ),
      },
    ],
    [t],
  )
}
