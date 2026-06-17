import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import { fallbackAccLvName } from '@/lib/entityDisplayLabels'
import type { AccLvInfo } from '@/types/api'

export const useAccLvColumns = (): ColumnDef<AccLvInfo>[] => {
  const { t } = useTranslation(['access', 'common'])

  return useMemo(
    () => [
      {
        key: 'name',
        header: t('access:field.name'),
        width: 200,
        sortable: true,
        render: (value) => (
          <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
            {fallbackAccLvName(typeof value === 'string' ? value : '')}
          </span>
        ),
      },
      {
        key: 'description',
        header: t('access:field.description'),
        sortable: true,
        render: (value) => (
          <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
            {typeof value === 'string' && value.trim() ? value : t('common:empty')}
          </span>
        ),
      },
    ],
    [t],
  )
}
