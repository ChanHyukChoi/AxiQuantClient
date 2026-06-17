import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import { fallbackCardFmtName } from '@/lib/app/entityDisplayLabels'
import type { CardfmtInfo } from '@/types/api'

export const useCardFmtColumns = (): ColumnDef<CardfmtInfo>[] => {
  const { t } = useTranslation('cardFmt')

  return useMemo(
    () => [
      {
        key: 'name',
        header: t('field.name'),
        width: 180,
        sortable: true,
        render: (value) => (
          <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
            {fallbackCardFmtName(typeof value === 'string' ? value : '')}
          </span>
        ),
      },
      {
        key: 'totalBits',
        header: t('column.bits'),
        width: 72,
        align: 'center',
        sortable: true,
        render: (value) => (
          <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {String(value ?? 0)}bit
          </span>
        ),
      },
      {
        key: 'minDigits',
        header: t('column.digits'),
        width: 88,
        align: 'center',
        sortable: true,
        render: (_, row) => (
          <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
            {row.minDigits}~{row.maxDigits}
          </span>
        ),
      },
    ],
    [t],
  )
}
