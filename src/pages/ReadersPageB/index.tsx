import { useMemo } from 'react'
import { ScanLine } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Button } from '@/components/primitive/Button'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { ReaderDetailWorkspace } from '@/pages/ReadersPage/components/ReaderDetailWorkspace'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readersMockData'
import { useReadersData } from '@/pages/ReadersPage/useReadersData'
import {
  formatDefMode,
  formatKpadMode,
  formatOffMode,
  formatReaderAddr,
  formatSioName,
  readerGridId,
  readerLabel,
} from '@/pages/ReadersPage/utils/readerDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'

const GRID_COLUMNS: ColumnDef<ReaderDisplayRow>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (_, row) => (
      <span
        className="text-[14px] truncate block"
        style={{ color: isDeviceActive(row.active) ? 'var(--color-text)' : 'var(--color-text-dim)' }}
      >
        {readerLabel(row)}
      </span>
    ),
  },
  {
    key: 'scpName',
    header: '주제어기',
    width: 110,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'sioName',
    header: '부제어기',
    width: 88,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {formatSioName(row.sio, row.sioName)}
      </span>
    ),
  },
  {
    key: 'addr',
    header: '어드레스',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {formatReaderAddr(Number(value))}
      </span>
    ),
  },
  {
    key: 'modelName',
    header: '모델',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'pairReaderName',
    header: '연관리더',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '—')}
      </span>
    ),
  },
  {
    key: 'defmode',
    header: '기본모드',
    width: 100,
    sortable: true,
    render: (value) => (
      <span className="text-[12px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {formatDefMode(Number(value))}
      </span>
    ),
  },
  {
    key: 'offmode',
    header: '오프라인',
    width: 72,
    sortable: true,
    render: (value) => (
      <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
        {formatOffMode(Number(value))}
      </span>
    ),
  },
  {
    key: 'kpadmode',
    header: '키패드',
    width: 64,
    sortable: true,
    render: (value) => (
      <span className="text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
        {formatKpadMode(Number(value))}
      </span>
    ),
  },
]

export const ReadersPageB = () => {
  const {
    useMock,
    filteredRows,
    selected,
    selectRow,
    setSearchQuery,
    isLoading,
    isError,
    patchMockRow,
  } = useReadersData()

  const gridData = useMemo(
    () => filteredRows.map((r) => ({ ...r, id: readerGridId(r) })),
    [filteredRows],
  )

  const handleToggleActive = (active: boolean) => {
    if (!selected || !useMock) return
    patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="리더"
        icon={<ScanLine size={15} />}
        variantPaths={{ a: '/readers', b: '/readers-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          className="flex flex-col min-h-0 overflow-hidden"
          style={{
            flex: '0 0 38%',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <Grid
            columns={GRID_COLUMNS}
            data={gridData}
            selectedId={selected ? readerGridId(selected) : undefined}
            onRowClick={(row) => {
              const orig = filteredRows.find((r) => readerGridId(r) === row.id)
              if (orig) selectRow(orig)
            }}
            onSearch={setSearchQuery}
            searchPlaceholder="리더 검색..."
            totalCount={filteredRows.length}
            loading={isLoading}
          />
          {isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              리더 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 overflow-hidden" style={{ flex: '1 1 62%' }}>
          <ReaderDetailWorkspace
            reader={selected}
            useMock={useMock}
            layout="horizontal"
            onToggleActive={handleToggleActive}
          />
        </div>

        <div
          className="flex-shrink-0 flex justify-end gap-1.5 px-3 py-2"
          style={{
            borderTop: '0.5px solid var(--color-border)',
            background: 'var(--color-sidebar)',
          }}
        >
          <Button variant="accent" size="sm" onClick={() => undefined}>
            추가
          </Button>
          <Button variant="default" size="sm" onClick={() => undefined}>
            확인
          </Button>
          <Button variant="default" size="sm" onClick={() => undefined}>
            취소
          </Button>
        </div>
      </div>
    </div>
  )
}
