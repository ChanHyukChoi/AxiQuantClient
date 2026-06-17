import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@/components/primitive/Grid'
import { ActiveGridMark } from '@/components/basic/ActiveStatusBadge'
import { linkageRuleSummary } from '@/pages/LinkagePage/utils/linkageDisplay'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

export type LinkageGridRow = LinkageRule & { summary: string }

export const useLinkageColumns = (): ColumnDef<LinkageGridRow>[] => {
  const { t } = useTranslation(['linkage', 'common'])

  return useMemo(
    () => [
      {
        key: 'name',
        header: t('linkage:field.name'),
        width: 280,
        sortable: true,
        render: (value) => (
          <span className="app-text-md truncate block" style={{ color: 'var(--color-text)' }}>
            {typeof value === 'string' ? value : t('common:empty')}
          </span>
        ),
      },
      {
        key: 'active',
        header: t('common:active'),
        width: 72,
        align: 'center',
        sortable: true,
        render: (value) => <ActiveGridMark active={value === true} />,
      },
      {
        key: 'summary',
        header: t('linkage:field.summary'),
        sortable: false,
        render: (value) => (
          <span className="app-text-md truncate block" style={{ color: 'var(--color-text-subtle)' }}>
            {typeof value === 'string' ? value : t('common:empty')}
          </span>
        ),
      },
    ],
    [t],
  )
}

export const toLinkageGridRows = (rules: LinkageRule[]): LinkageGridRow[] =>
  rules.map((r) => ({ ...r, summary: linkageRuleSummary(r) }))
