import { useEffect, useMemo, useState } from 'react'
import { Binary } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { PageHeader } from '@/layouts/PageHeader'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { AddButton, CrudDetailActions } from '@/components/page-actions'
import { useGridColumnLayout } from '@/hooks/ui/useGridColumnLayout'
import { BitVisualizer } from '@/pages/CardFmtPage/BitVisualizer'
import { CardFmtBitStatGrid } from '@/pages/CardFmtPageB/components/CardFmtBitStatGrid'
import { fallbackCardFmtName } from '@/lib/entityDisplayLabels'
import { useCardFmts } from '@/hooks/api/useCardfmt'
import type { CardfmtInfo } from '@/types/api'

const WIEGAND_BADGE_STYLE: React.CSSProperties = {
  background: 'color-mix(in srgb, #7f77dd 25%, transparent)',
  color: '#b8a8ff',
  border: '0.5px solid color-mix(in srgb, #7f77dd 50%, transparent)',
}

const BASE_GRID_COLUMNS: ColumnDef<CardfmtInfo>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackCardFmtName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
  {
    key: 'totalBits',
    header: '비트',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? 0)}bit
      </span>
    ),
  },
  {
    key: 'minDigits',
    header: '자릿수',
    width: 88,
    align: 'center',
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {row.minDigits}~{row.maxDigits}
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

/**
 * 카드 형식 2안 — WPF 유사 상·하 분할 (Grid 마스터 + 하단 정보/비트 구조)
 */
export const CardFmtPageB = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [editMode, setEditMode] = useState(false)

  const { columns, layoutGridProps } = useGridColumnLayout(BASE_GRID_COLUMNS, {
    storageKey: 'axiquant.grid.cardfmt-b',
  })

  const { data: cardfmtList, isLoading, isError } = useCardFmts()

  const filteredList = useMemo(() => {
    const list = cardfmtList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((item) => item.name.toLowerCase().includes(q))
  }, [cardfmtList, searchQuery])

  const selectedCardfmt = useMemo(
    () => filteredList.find((item) => item.id === selectedId) ?? null,
    [filteredList, selectedId],
  )

  useEffect(() => {
    setEditMode(false)
  }, [selectedId])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="카드 형식"
        icon={<Binary size={15} style={{ color: '#7f77dd' }} />}
        variantPaths={{ a: '/cardfmt', b: '/cardfmt-b' }}
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
            searchPlaceholder="형식 검색..."
            totalCount={filteredList.length}
            loading={isLoading}
            {...layoutGridProps}
          />
          {isError ? (
            <p className="text-[13px] px-3 py-1" style={{ color: 'var(--color-danger)' }}>
              카드 형식 목록을 불러오지 못했습니다.
            </p>
          ) : null}
        </div>

        <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
          {selectedCardfmt ? (
            <DetailTitleBar
              icon={<Binary size={14} style={{ color: '#7f77dd' }} />}
              title={fallbackCardFmtName(selectedCardfmt.name)}
              badge={
                <span
                  className="inline-flex items-center text-[12px] font-medium px-1.5 py-0.5 rounded-full"
                  style={WIEGAND_BADGE_STYLE}
                >
                  WIEGAND
                </span>
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
              className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
              style={{
                background: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                borderBottom: '0.5px solid var(--color-border)',
              }}
            >
              정보
            </div>
            <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
              {selectedCardfmt ? (
                <div className="flex flex-col gap-3">
                  <InfoField label="명칭">
                    <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                      {fallbackCardFmtName(selectedCardfmt.name)}
                    </span>
                  </InfoField>
                  <InfoField label="유형">
                    <span
                      className="inline-flex items-center text-[12px] font-medium px-1.5 py-0.5 rounded-full w-fit"
                      style={WIEGAND_BADGE_STYLE}
                    >
                      WIEGAND
                    </span>
                  </InfoField>
                  <InfoField label="시설 코드">
                    <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                      {selectedCardfmt.facility}
                    </span>
                  </InfoField>
                  <InfoField label="카드 오프셋">
                    <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                      {selectedCardfmt.idOffset}
                    </span>
                  </InfoField>
                  <InfoField label="자릿수">
                    <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
                      {selectedCardfmt.minDigits} ~ {selectedCardfmt.maxDigits}
                    </span>
                  </InfoField>
                </div>
              ) : (
                <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
                  상단 목록에서 형식을 선택하세요.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <div
              className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
              style={{
                borderBottom: '0.5px solid var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              비트 구조
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto app-scrollbar p-3">
              {selectedCardfmt ? (
                <>
                  <CardFmtBitStatGrid cardfmt={selectedCardfmt} />
                  <p
                    className="text-[14px] font-medium mb-2"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    비트 구조 시각화
                  </p>
                  <BitVisualizer fmt={selectedCardfmt} />
                </>
              ) : (
                <p
                  className="text-[14px] text-center py-8"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  비트 구조를 보려면 형식을 선택하세요.
                </p>
              )}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
