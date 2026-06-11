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
    header: '??',
    width: 200,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackAccLvName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
]

/** ???? 2? ? WPF ?? ?�? ?? (Grid ??? + ?? ??/?? ???) */
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
        title="?? ??"
        icon={<Lock size={15} />}
        variantPaths={{ a: '/access', b: '/access-b' }}
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
            columns={GRID_COLUMNS}
            data={filteredList}
            selectedId={selectedId ?? undefined}
            onRowClick={(row) => setSelectedId(row.id)}
            onSearch={setSearchQuery}
            searchPlaceholder="?? ??..."
            totalCount={filteredList.length}
            loading={isLoading}
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
              className="flex-shrink-0 px-3 py-2 text-[14px] font-medium"
              style={{
                background: 'var(--color-accent-subtle)',
                color: 'var(--color-accent)',
                borderBottom: '0.5px solid var(--color-border)',
              }}
            >
              ??
            </div>
            <div className="flex-1 p-3 overflow-y-auto app-scrollbar">
              {selectedAccLv ? (
                <div className="flex flex-col gap-2">
                  <div>
                    <span
                      className="text-[13px] block mb-0.5"
                      style={{ color: 'var(--color-text-subtle)' }}
                    >
                      ??
                    </span>
                    <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
                      {fallbackAccLvName(selectedAccLv.name)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
                  ?? ???? ??? ?????.
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
                ??
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
                  ?? ??? ??? ??? ?????.
                </p>
              )}
            </div>
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
            ??
          </Button>
          <Button
            variant="default"
            size="sm"
            disabled={!selectedAccLv}
            onClick={() => undefined}
          >
            ??
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={!selectedAccLv}
            onClick={() => undefined}
          >
            ??
          </Button>
        </div>
      </div>
    </div>
  )
}
