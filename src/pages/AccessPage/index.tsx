import { useMemo, useState } from 'react'
import { DoorOpen, Plus } from 'lucide-react'
import { ListPanel } from '@/components/ui/ListPanel'
import { Button } from '@/components/ui/Button'
import { AccessDrawer } from '@/pages/AccessPage/AccessDrawer'
import { useAccLvList } from '@/hooks/useAccLv'

export const AccessPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: accLvList, isLoading: accLvLoading } = useAccLvList()

  const selectedAccLv = useMemo(
    () => accLvList?.find((a) => a.id === selectedId) ?? null,
    [accLvList, selectedId],
  )

  const filteredList = useMemo(() => {
    if (!accLvList) return []
    if (!searchQuery.trim()) return accLvList
    const q = searchQuery.toLowerCase()
    return accLvList.filter((a) => a.name.toLowerCase().includes(q))
  }, [accLvList, searchQuery])

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid #2a2d32',
        }}
      >
        <div className="flex items-center gap-1.5">
          <DoorOpen style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            접근 권한
          </span>
        </div>
        <Button variant="accent" leftIcon={<Plus size={12} />}>
          추가
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <ListPanel
          items={filteredList.map((a) => ({ id: a.id, label: a.name }))}
          selectedId={selectedId ?? undefined}
          onItemClick={(item) => {
            if (editMode) setEditMode(false)
            setSelectedId(item.id)
          }}
          onSearch={setSearchQuery}
          searchPlaceholder="권한 검색..."
          totalCount={filteredList.length}
          width={240}
          loading={accLvLoading}
        />
        <AccessDrawer
          selectedAccLv={selectedAccLv}
          onDeleted={() => setSelectedId(null)}
          onEditModeChange={setEditMode}
        />
      </div>
    </div>
  )
}
