import { useMemo, useState } from 'react'
import { Lock } from 'lucide-react'
import { Grid, type ColumnDef } from '@/components/primitive/Grid'
import { Button } from '@/components/primitive/Button'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { AccLvReaderTable } from '@/pages/AccessPage/components/AccLvReaderTable'
import { mockReadersForAccLv } from '@/pages/AccessPageB/accessBMockData'
import { fallbackAccLvName } from '@/lib/entityDisplayLabels'
import { useAccLvList } from '@/hooks/api/useAccLv'
import type { AccLvInfo } from '@/types/api'

const GRID_COLUMNS: ColumnDef<AccLvInfo>[] = [
  {
    key: 'name',
    header: '명칭',
    width: 200,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackAccLvName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
]

/**
 * 접근권한 2안 — WPF 유사 상·하 분할 (Grid 마스터 + 하단 정보/연결 테이블)
 * 회의용 목업. 하단 액션·변경은 UI만 제공.
 */
export const AccessPageB = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: accLvList, isLoading } = useAccLvList()

  const filteredList = useMemo(() => {
    const list = accLvList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((a) => a.name.toLowerCase().includes(q))
  }, [accLvList, searchQuery])

  const selectedAccLv = useMemo(
    () => filteredList.find((a) => a.id === selectedId) ?? null,
    [filteredList, selectedId],
  )

  const readerRows = useMemo(
    () => (selectedId != null ? mockReadersForAccLv(selectedId) : []),
    [selectedId],
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="접근 권한"
        icon={<Lock size={15} />}
        variantPaths={{ a: '/access', b: '/access-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* 상단: WPF 스타일 마스터 Grid */}
        <div
          className="flex flex-col min-h-0 overflow-hidden"
          style={{
            flex: '0 0 42%',
            borderBottom: '0.5px solid var(--color-border)',
          }}
        >
          <Grid
            columns={GRID_COLUMNS}
            data={filteredList}
            selectedId={selectedId ?? undefined}
            onRowClick={(row) => setSelectedId(row.id)}
            onSearch={setSearchQuery}
            searchPlaceholder="권한 검색..."
            totalCount={filteredList.length}
            loading={isLoading}
          />
        </div>

        {/* 하단: 정보 + 연결 테이블 */}
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
              {selectedAccLv ? (
                <div className="flex flex-col gap-2">
                  <div>
                    <span
                      className="text-[13px] block mb-0.5"
                      style={{ color: 'var(--color-text-subtle)' }}
                    >
                      명칭
                    </span>
                    <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                      {fallbackAccLvName(selectedAccLv.name)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
                  상단 목록에서 권한을 선택하세요.
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <div
              className="flex items-center justify-end flex-shrink-0 px-3 py-2"
              style={{ borderBottom: '0.5px solid var(--color-border)' }}
            >
              <Button
                variant="default"
                size="sm"
                disabled={!selectedAccLv}
                onClick={() => undefined}
              >
                변경
              </Button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto app-scrollbar p-3">
              {selectedAccLv ? (
                <AccLvReaderTable rows={readerRows} />
              ) : (
                <p
                  className="text-[14px] text-center py-8"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  연결 리더를 보려면 권한을 선택하세요.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* WPF 스타일 하단 액션 바 */}
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
          <Button
            variant="default"
            size="sm"
            disabled={!selectedAccLv}
            onClick={() => undefined}
          >
            수정
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedAccLv}
            onClick={() => undefined}
          >
            삭제
          </Button>
        </div>
      </div>

      <p
        className="flex-shrink-0 text-center text-[12px] py-1"
        style={{
          color: 'var(--color-text-dim)',
          borderTop: '0.5px solid var(--color-border-subtle)',
          background: 'var(--color-sidebar)',
        }}
      >
        레이아웃 2안 (WPF 유사) — 회의용 목업
      </p>
    </div>
  )
}
