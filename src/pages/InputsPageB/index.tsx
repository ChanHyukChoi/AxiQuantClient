import { useEffect, useMemo, useState } from 'react'
import { ArrowRightToLine } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Badge } from '@/components/primitive/Badge'
import { Checkbox } from '@/components/primitive/Checkbox'
import { PageHeader } from '@/layouts/PageHeader'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
import type { InputDisplayRow } from '@/pages/InputsPage/inputsMockData'
import { inputGridId } from '@/pages/InputsPage/inputsMockData'
import { useInputsData } from '@/pages/InputsPage/useInputsData'
import {
  formatInputAddr,
  formatInputMode,
  formatSioName,
  inputLabel,
} from '@/pages/InputsPage/utils/inputDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'

const BASE_GRID_COLUMNS: ColumnDef<InputDisplayRow>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {inputLabel(row)}
      </span>
    ),
  },
  {
    key: 'active',
    header: '활성',
    width: 64,
    align: 'center',
    sortable: true,
    render: (value) =>
      isDeviceActive(Number(value)) ? (
        <span style={{ color: 'var(--color-accent)' }}>✓</span>
      ) : null,
  },
  {
    key: 'scpName',
    header: '주제어기',
    width: 120,
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
    width: 100,
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
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {formatInputAddr(Number(value))}
      </span>
    ),
  },
  {
    key: 'mode',
    header: '모드',
    width: 140,
    sortable: true,
    render: (value) => (
      <span className="text-[13px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {formatInputMode(Number(value))}
      </span>
    ),
  },
  {
    key: 'holdtime',
    header: '유지(s)',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? 0)}
      </span>
    ),
  },
]

const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <span className="text-[13px] block mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

export const InputsPageB = () => {
  const [editMode, setEditMode] = useState(false)
  const { columns, layoutGridProps } = useGridColumnLayout(BASE_GRID_COLUMNS, {
    storageKey: 'axiquant.grid.inputs-b',
  })

  const {
    useMock,
    filteredRows,
    selected,
    selectRow,
    setSearchQuery,
    isLoading,
    isError,
    patchMockRow,
  } = useInputsData()

  const gridData = useMemo(
    () => filteredRows.map((r) => ({ ...r, id: inputGridId(r) })),
    [filteredRows],
  )

  const handleToggleActive = (active: boolean) => {
    if (!selected || !useMock) return
    patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
  }

  useEffect(() => {
    setEditMode(false)
  }, [selected?.scp, selected?.id])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="입력"
        icon={<ArrowRightToLine size={15} />}
        variantPaths={{ a: '/inputs', b: '/inputs-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <div
          className="flex flex-col min-h-0 overflow-hidden"
          style={{
            flex: '0 0 48%',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <Grid
            columns={columns}
            data={gridData}
            selectedId={selected ? inputGridId(selected) : undefined}
            onRowClick={(row) => {
              const orig = filteredRows.find((r) => inputGridId(r) === row.id)
              if (orig) selectRow(orig)
            }}
            onSearch={setSearchQuery}
            searchPlaceholder="입력 검색..."
            totalCount={filteredRows.length}
            loading={isLoading}
            {...layoutGridProps}
          />
          {isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              입력 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {selected ? (
            <DetailTitleBar
              icon={<ArrowRightToLine size={14} style={{ color: 'var(--color-accent)' }} />}
              title={inputLabel(selected)}
              badge={
                <Badge variant={isDeviceActive(selected.active) ? 'on' : 'off'}>
                  {isDeviceActive(selected.active) ? '활성' : '비활성'}
                </Badge>
              }
              actions={
                <CrudDetailActions
                  editMode={editMode}
                  onEdit={() => setEditMode(true)}
                  onDelete={() => undefined}
                  onSave={() => setEditMode(false)}
                  onCancel={() => setEditMode(false)}
                />
              }
            />
          ) : null}
          <div className="flex-1 p-4 overflow-y-auto app-scrollbar">
            {selected ? (
              <div className="max-w-md flex flex-col gap-3">
                <InfoField label="주제어기">
                  <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                    {selected.scpName}
                  </span>
                </InfoField>
                <InfoField label="부제어기">
                  <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                    {formatSioName(selected.sio, selected.sioName)}
                  </span>
                </InfoField>
                <InfoField label="어드레스">
                  <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                    {formatInputAddr(selected.addr)}
                  </span>
                </InfoField>
                <InfoField label="모드">
                  <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                    {formatInputMode(selected.mode)}
                  </span>
                </InfoField>
                <InfoField label="레버 센서">
                  <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                    {selected.icvt}
                  </span>
                </InfoField>
                <InfoField label="유지 시간">
                  <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                    {selected.holdtime} sec
                  </span>
                </InfoField>
                <InfoField label="활성">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={isDeviceActive(selected.active)}
                      disabled={!useMock}
                      onChange={handleToggleActive}
                    />
                    <Badge variant={isDeviceActive(selected.active) ? 'on' : 'off'}>
                      {isDeviceActive(selected.active) ? '활성' : '비활성'}
                    </Badge>
                  </label>
                </InfoField>
              </div>
            ) : (
              <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
                상단 목록에서 입력을 선택하세요.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
