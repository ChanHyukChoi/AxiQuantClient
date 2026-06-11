import { useMemo } from 'react'
import { Link2 } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Button } from '@/components/primitive/Button'
import { Badge } from '@/components/primitive/Badge'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton, ExportButton, ImportButton } from '@/components/page-actions'
import { LinkageGeneralSection } from '@/pages/LinkagePage/components/LinkageGeneralSection'
import { LinkageThenSection } from '@/pages/LinkagePage/components/LinkageThenSection'
import { LinkageWhenSection } from '@/pages/LinkagePage/components/LinkageWhenSection'
import { linkageRuleSummary } from '@/pages/LinkagePage/utils/linkageDisplay'
import { useLinkageData } from '@/pages/LinkagePage/useLinkageData'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

const GRID_COLUMNS: ColumnDef<LinkageRule>[] = [
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
    render: (value) => (
      <Badge variant={value === true ? 'on' : 'off'}>{value === true ? '활성' : '비활성'}</Badge>
    ),
  },
  {
    key: 'summary',
    header: '요약',
    sortable: false,
    render: (_value, row) => (
      <span className="app-text-md truncate block" style={{ color: 'var(--color-text-subtle)' }}>
        {linkageRuleSummary(row)}
      </span>
    ),
  },
]

/** 연동 B안 — 상 Grid 마스터 + 하 3단 (일반 | 조건 | 동작) */
export const LinkagePageB = () => {
  const { rules, selectedId, selectedRule, setSearchQuery, selectRule } = useLinkageData()

  const gridData = useMemo(
    () => rules.map((r) => ({ ...r, summary: linkageRuleSummary(r) })),
    [rules],
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="연동"
        icon={<Link2 size={15} />}
        variantPaths={{ a: '/linkage', b: '/linkage-b' }}
        actions={
          <>
            <ImportButton size="sm" showLabel={false} onClick={() => undefined} />
            <ExportButton size="sm" showLabel={false} onClick={() => undefined} />
            <AddButton onClick={() => undefined} />
          </>
        }
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          className="flex flex-col min-h-0 overflow-hidden"
          style={{
            flex: '0 0 42%',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <Grid
            columns={GRID_COLUMNS}
            data={gridData}
            selectedId={selectedId ?? undefined}
            onRowClick={(row) => selectRule(row.id)}
            onSearch={setSearchQuery}
            searchPlaceholder="명칭 검색..."
            totalCount={rules.length}
          />
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div
            className="flex flex-col flex-shrink-0 overflow-hidden"
            style={{
              width: 220,
              borderRight: '0.5px solid var(--color-border)',
              background: 'var(--color-sidebar)',
            }}
          >
            <div
              className="flex-shrink-0 px-3 py-2 app-text-md font-medium"
              style={{
                background: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                borderBottom: '0.5px solid var(--color-border)',
              }}
            >
              일반
            </div>
            <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
              <LinkageGeneralSection rule={selectedRule} layout="compact" />
            </div>
          </div>

          <div
            className="flex flex-col flex-1 min-w-0 overflow-hidden"
            style={{ borderRight: '0.5px solid var(--color-border)' }}
          >
            <LinkageWhenSection rows={selectedRule?.when ?? []} compact />
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <LinkageThenSection rows={selectedRule?.then ?? []} compact />
          </div>
        </div>

        <div
          className="flex items-center justify-end gap-2 flex-shrink-0 px-3"
          style={{
            height: 44,
            borderTop: '0.5px solid var(--color-border)',
            background: 'var(--color-sidebar)',
          }}
        >
          <Button variant="accent" size="sm" onClick={() => undefined}>
            추가
          </Button>
          <Button variant="default" size="sm" disabled={!selectedRule} onClick={() => undefined}>
            수정
          </Button>
          <Button variant="danger" size="sm" disabled={!selectedRule} onClick={() => undefined}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  )
}
