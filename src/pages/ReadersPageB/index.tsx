import { useEffect, useMemo, useState } from 'react'
import { ScanLine } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { ReaderDetailWorkspace } from '@/pages/ReadersPage/components/ReaderDetailWorkspace'
import type { ReaderDisplayRow } from '@/pages/ReadersPage/readersMockData'
import { useReadersData } from '@/pages/ReadersPage/useReadersData'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
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

const BASE_GRID_COLUMNS: ColumnDef<ReaderDisplayRow>[] = [
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
  const [editMode, setEditMode] = useState(false)

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

  const { columns, layoutGridProps } = useGridColumnLayout(BASE_GRID_COLUMNS, {
    storageKey: 'axiquant.grid.readers-b',
  })

  const gridData = useMemo(
    () => filteredRows.map((r) => ({ ...r, id: readerGridId(r) })),
    [filteredRows],
  )

  useEffect(() => {
    setEditMode(false)
  }, [selected?.scp, selected?.id])

  const handleToggleActive = (active: boolean) => {
    if (!selected || !useMock) return
    patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
  }

  const titleActions = selected ? (
    <CrudDetailActions
      editMode={editMode}
      onEdit={() => setEditMode(true)}
      onDelete={() => undefined}
      onSave={() => setEditMode(false)}
      onCancel={() => setEditMode(false)}
    />
  ) : null

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
            columns={columns}
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
            {...layoutGridProps}
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
            titleActions={titleActions}
          />
        </div>
      </div>
    </div>
  )
}
