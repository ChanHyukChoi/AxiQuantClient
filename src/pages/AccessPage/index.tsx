import { useCallback, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { DoorOpen } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { AccessDetailPanel } from '@/pages/AccessPage/AccessDetailPanel'
import { AccessListPane } from '@/pages/AccessPage/components/AccessListPane'
import { CreateAccLvModal } from '@/pages/AccessPage/components/CreateAccLvModal'
import { getAccLvList } from '@/api/acclv'
import { useAccLvList } from '@/hooks/api/useAccLv'
import { queryKeys } from '@/lib/query/queryKeys'
import type { AccLvInfo } from '@/types/api'

export const AccessPage = () => {
  const qc = useQueryClient()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

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

  const handleSelect = (item: AccLvInfo) => {
    if (editMode) setEditMode(false)
    setSelectedId(item.id)
  }

  const handleCreated = useCallback(
    async (name: string) => {
      setCreateOpen(false)
      const list = await qc.fetchQuery({
        queryKey: queryKeys.acclv.all,
        queryFn: getAccLvList,
      })
      const created = list?.find((a) => a.name === name)
      if (created) setSelectedId(created.id)
    },
    [qc],
  )

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="접근 권한"
        icon={<DoorOpen size={15} />}
        variantPaths={{ a: '/access', b: '/access-b' }}
        actions={<AddButton onClick={() => setCreateOpen(true)} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <AccessListPane
          items={filteredList}
          selectedId={selectedId}
          searchQuery={searchQuery}
          loading={accLvLoading}
          onSearch={setSearchQuery}
          onSelect={handleSelect}
        />
        <AccessDetailPanel
          accLv={selectedAccLv}
          onDeleted={() => setSelectedId(null)}
          onEditModeChange={setEditMode}
        />
      </div>

      <CreateAccLvModal
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}
