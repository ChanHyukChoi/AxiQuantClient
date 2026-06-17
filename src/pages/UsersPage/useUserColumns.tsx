import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import type { UserInfo } from '@/types/api/user'

export const useUserColumns = (): ColumnDef<UserInfo>[] => {
  const { t } = useTranslation(['user', 'common'])

  return useMemo(
    () => [
      {
        key: 'loginId',
        header: t('user:field.loginId'),
        width: 120,
        sortable: true,
        render: (value) => (
          <span
            className="text-[14px] font-mono truncate block"
            style={{ color: 'var(--color-text)' }}
          >
            {String(value ?? '')}
          </span>
        ),
      },
      {
        key: 'name',
        header: t('user:field.name'),
        width: 140,
        sortable: true,
        render: (value) => (
          <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
            {typeof value === 'string' && value.trim() ? value : t('user:noName')}
          </span>
        ),
      },
      {
        key: 'active',
        header: t('user:field.active'),
        width: 64,
        align: 'center',
        sortable: true,
        render: (value) =>
          value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
      },
      {
        key: 'useExternalApi',
        header: t('user:field.externalApi'),
        width: 80,
        align: 'center',
        sortable: true,
        render: (value) =>
          value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
      },
    ],
    [t],
  )
}
