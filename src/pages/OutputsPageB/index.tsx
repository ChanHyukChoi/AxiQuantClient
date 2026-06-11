import { useMemo } from 'react'
import { ArrowLeftFromLine } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Badge } from '@/components/primitive/Badge'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import type { OutputDisplayRow } from '@/pages/OutputsPage/outputsMockData'
import { outputGridId } from '@/pages/OutputsPage/outputsMockData'
import { useOutputsData } from '@/pages/OutputsPage/useOutputsData'
import {
  formatOutputAddr,
  formatSioName,
  outputLabel,
} from '@/pages/OutputsPage/utils/outputDisplay'
import { isDeviceActive } from '@/pages/DeviceControlPage/utils/deviceHelpers'

const GRID_COLUMNS: ColumnDef<OutputDisplayRow>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {outputLabel(row)}
      </span>
    ),
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
        {formatOutputAddr(Number(value))}
      </span>
    ),
  },
  {
    key: 'defpulse',
    header: '지속 시간',
    width: 88,
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

export const OutputsPageB = () => {
  const {
    useMock,
    filteredRows,
    selected,
    selectRow,
    setSearchQuery,
    isLoading,
    isError,
    patchMockRow,
  } = useOutputsData()

  const gridData = useMemo(
    () => filteredRows.map((r) => ({ ...r, id: outputGridId(r) })),
    [filteredRows],
  )

  const handleToggleActive = (active: boolean) => {
    if (!selected || !useMock) return
    patchMockRow(selected.scp, selected.id, { active: active ? 1 : 0 })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="출력"
        icon={<ArrowLeftFromLine size={15} />}
        variantPaths={{ a: '/outputs', b: '/outputs-b' }}
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
            columns={GRID_COLUMNS}
            data={gridData}
            selectedId={selected ? outputGridId(selected) : undefined}
            onRowClick={(row) => {
              const orig = filteredRows.find((r) => outputGridId(r) === row.id)
              if (orig) selectRow(orig)
            }}
            onSearch={setSearchQuery}
            searchPlaceholder="출력 검색..."
            totalCount={filteredRows.length}
            loading={isLoading}
          />
          {isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              출력 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          <div
            className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
            style={{
              background: 'var(--color-accent-subtle)',
              color: 'var(--color-accent)',
              borderBottom: '0.5px solid var(--color-border)',
            }}
          >
            일반
          </div>
          <div className="flex-1 p-4 overflow-y-auto app-scrollbar">
            {selected ? (
              <div className="max-w-md flex flex-col gap-3">
                <InfoField label="명칭">
                  <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                    {outputLabel(selected)}
                  </span>
                </InfoField>
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
                    {formatOutputAddr(selected.addr)}
                  </span>
                </InfoField>
                <InfoField label="지속 시간">
                  <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                    {selected.defpulse} sec
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
                상단 목록에서 출력을 선택하세요.
              </p>
            )}
          </div>
        </div>

        <div
          className="flex-shrink-0 flex justify-end gap-1.5 px-3 py-2"
          style={{
            borderTop: '0.5px solid var(--color-border)',
            background: 'var(--color-sidebar)',
          }}
        >
          <Button variant="accent" size="sm" onClick={() => undefined}>
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
