import { useEffect, useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Badge } from '@/components/primitive/Badge'
import { PageHeader } from '@/layouts/PageHeader'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
import {
  mockOccupantsForArea,
  mockReadersForArea,
} from '@/pages/AreaPageB/areaBMockData'
import {
  isAreaActive,
  occupancyPercent,
} from '@/pages/AreaPage/utils/areaHelpers'
import { fallbackAreaName } from '@/lib/entityDisplayLabels'
import { useAreas } from '@/hooks/api/useArea'
import type { AreaInfo } from '@/types/api'

const BASE_GRID_COLUMNS: ColumnDef<AreaInfo>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackAreaName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '상태',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => {
      const active = isAreaActive(Number(value))
      return (
        <Badge variant={active ? 'on' : 'off'}>{active ? '활성' : '비활성'}</Badge>
      )
    },
  },
  {
    key: 'occup',
    header: '점유',
    width: 100,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.occup}/{row.occmax}
      </span>
    ),
  },
]

/**
 * 영역 2안 — WPF 유사 상·하 분할 (Grid 마스터 + 하단 정보/상세)
 */
export const AreaPageB = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [detailTab, setDetailTab] = useState<'readers' | 'occupants'>('readers')
  const [editMode, setEditMode] = useState(false)

  const { columns, layoutGridProps } = useGridColumnLayout(BASE_GRID_COLUMNS, {
    storageKey: 'axiquant.grid.area-b',
  })

  const { data: areaList, isLoading, isError } = useAreas()

  const filteredList = useMemo(() => {
    const list = areaList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((a) => a.name.toLowerCase().includes(q))
  }, [areaList, searchQuery])

  const selectedArea = useMemo(
    () => filteredList.find((a) => a.id === selectedId) ?? null,
    [filteredList, selectedId],
  )

  const readerRows = useMemo(
    () => (selectedId != null ? mockReadersForArea(selectedId) : []),
    [selectedId],
  )

  const occupantRows = useMemo(
    () => (selectedId != null ? mockOccupantsForArea(selectedId) : []),
    [selectedId],
  )

  useEffect(() => {
    setEditMode(false)
  }, [selectedId])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="영역"
        icon={<MapPin size={15} />}
        variantPaths={{ a: '/area', b: '/area-b' }}
        actions={<AddButton onClick={() => undefined} />}
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
            columns={columns}
            data={filteredList}
            selectedId={selectedId ?? undefined}
            onRowClick={(row) => setSelectedId(row.id)}
            onSearch={setSearchQuery}
            searchPlaceholder="영역 검색..."
            totalCount={filteredList.length}
            loading={isLoading}
            {...layoutGridProps}
          />
          {isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              영역 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {selectedArea ? (
            <DetailTitleBar
              icon={<MapPin size={14} style={{ color: 'var(--color-accent)' }} />}
              title={fallbackAreaName(selectedArea.name)}
              badge={
                <Badge variant={isAreaActive(selectedArea.active) ? 'on' : 'off'}>
                  {isAreaActive(selectedArea.active) ? '활성' : '비활성'}
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
              정보
            </div>
            <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
              {selectedArea ? (
                <div className="flex flex-col gap-3">
                  <DetailInfoField label="명칭">
                    {fallbackAreaName(selectedArea.name)}
                  </DetailInfoField>
                  <DetailInfoField label="상태">
                    <Badge variant={isAreaActive(selectedArea.active) ? 'on' : 'off'}>
                      {isAreaActive(selectedArea.active) ? '활성' : '비활성'}
                    </Badge>
                  </DetailInfoField>
                  <DetailInfoField label="점유">
                    <span className="font-mono">
                      {selectedArea.occup} / {selectedArea.occmax} (
                      {occupancyPercent(selectedArea.occup, selectedArea.occmax)}%)
                    </span>
                  </DetailInfoField>
                  <DetailInfoField label="최대 점유">
                    <span className="font-mono">{selectedArea.occmax}</span>
                  </DetailInfoField>
                </div>
              ) : (
                <p className="app-text-md" style={{ color: 'var(--color-text-subtle)' }}>
                  상단 목록에서 영역을 선택하세요.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <div
              className="flex items-center gap-1 flex-shrink-0 px-3 py-2"
              style={{ borderBottom: '0.5px solid var(--color-border)' }}
            >
              {(
                [
                  { key: 'readers' as const, label: '연결 리더' },
                  { key: 'occupants' as const, label: '점유 인원' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setDetailTab(tab.key)}
                  className="text-[14px] px-2.5 py-1 rounded"
                  style={{
                    color:
                      detailTab === tab.key
                        ? 'var(--color-accent)'
                        : 'var(--color-text-subtle)',
                    background:
                      detailTab === tab.key
                        ? 'var(--color-accent-subtle)'
                        : 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto app-scrollbar p-3">
              {!selectedArea ? (
                <p
                  className="text-[14px] text-center py-8"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  상세를 보려면 영역을 선택하세요.
                </p>
              ) : detailTab === 'readers' ? (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['주 제어기', '리더'].map((h) => (
                        <th
                          key={h}
                          className="text-[13px] font-medium py-2 px-2.5 text-left"
                          style={{
                            color: 'var(--color-text-subtle)',
                            borderBottom: '0.5px solid var(--color-border)',
                            background: 'var(--color-btn-hover)',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {readerRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-[14px] py-6 text-center"
                          style={{ color: 'var(--color-text-subtle)' }}
                        >
                          연결된 리더가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      readerRows.map((row, idx) => (
                        <tr key={`${row.scpName}-${row.readerName}-${idx}`}>
                          <td
                            className="text-[14px] py-2 px-2.5"
                            style={{
                              color: 'var(--color-text)',
                              borderBottom: '0.5px solid var(--color-border-subtle)',
                            }}
                          >
                            {row.scpName}
                          </td>
                          <td
                            className="text-[14px] py-2 px-2.5"
                            style={{
                              color: 'var(--color-text)',
                              borderBottom: '0.5px solid var(--color-border-subtle)',
                            }}
                          >
                            {row.readerName}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['사용자', '카드번호'].map((h) => (
                        <th
                          key={h}
                          className="text-[13px] font-medium py-2 px-2.5 text-left"
                          style={{
                            color: 'var(--color-text-subtle)',
                            borderBottom: '0.5px solid var(--color-border)',
                            background: 'var(--color-btn-hover)',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {occupantRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="text-[14px] py-6 text-center"
                          style={{ color: 'var(--color-text-subtle)' }}
                        >
                          점유 인원이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      occupantRows.map((row) => (
                        <tr key={row.empId}>
                          <td
                            className="text-[14px] py-2 px-2.5"
                            style={{
                              color: 'var(--color-text)',
                              borderBottom: '0.5px solid var(--color-border-subtle)',
                            }}
                          >
                            {row.name}
                          </td>
                          <td
                            className="text-[14px] py-2 px-2.5 font-mono"
                            style={{
                              color: 'var(--color-text-muted)',
                              borderBottom: '0.5px solid var(--color-border-subtle)',
                            }}
                          >
                            {row.cardNumber}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
