import { type ColumnDef } from '@/components/primitive/Grid'
import { ActiveGridMark } from '@/components/basic/ActiveStatusBadge'
import { linkageRuleSummary } from '@/pages/LinkagePage/utils/linkageDisplay'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

export type LinkageGridRow = LinkageRule & { summary: string }

export const useLinkageColumns = (): ColumnDef<LinkageGridRow>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 280,
    sortable: true,
    render: (value) => (
      <span className="app-text-md truncate block" style={{ color: 'var(--color-text)' }}>
        {typeof value === 'string' ? value : '—'}
      </span>
    ),
  },
  {
    key: 'active',
    header: '활성',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => <ActiveGridMark active={value === true} />,
  },
  {
    key: 'summary',
    header: '요약',
    sortable: false,
    render: (value) => (
      <span className="app-text-md truncate block" style={{ color: 'var(--color-text-subtle)' }}>
        {typeof value === 'string' ? value : '—'}
      </span>
    ),
  },
]

export const toLinkageGridRows = (rules: LinkageRule[]): LinkageGridRow[] =>
  rules.map((r) => ({ ...r, summary: linkageRuleSummary(r) }))
