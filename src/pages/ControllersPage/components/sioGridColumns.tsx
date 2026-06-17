import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { ColumnDef } from '@/components/primitive/Grid'
import { ActiveGridMark } from '@/components/basic/ActiveStatusBadge'
import { entityLabel, isDeviceActive } from '@/lib/device/deviceHelpers'
import type { SioInfo } from '@/types/api'

export const useSioGridColumns = (): ColumnDef<SioInfo>[] => {
  const { t } = useTranslation('common')

  return useMemo(
    () => [
      {
        key: 'port',
        header: t('port'),
        width: 80,
        sortable: true,
        render: (value) => (
          <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {Number(value) > 0 ? `PORT ${value}` : t('empty')}
          </span>
        ),
      },
      {
        key: 'name',
        header: t('name'),
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
        header: t('model'),
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
        header: t('address'),
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
        header: t('status'),
        width: 80,
        align: 'center',
        sortable: true,
        render: (value) => <ActiveGridMark active={isDeviceActive(Number(value))} />,
      },
    ],
    [t],
  )
}
