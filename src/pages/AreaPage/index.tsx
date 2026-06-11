import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
import { AreaDrawer } from '@/pages/AreaPage/AreaDrawer'
import { AreaListPane } from '@/pages/AreaPage/AreaListPane'
import { useAreas } from '@/hooks/api/useArea'
import type { AreaInfo } from '@/types/api'

export const AreaPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: areaList, isLoading, isError } = useAreas()

  const filteredAreas = useMemo(() => {
    const list = areaList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((a) => a.name.toLowerCase().includes(q))
  }, [areaList, searchQuery])

  const selectedArea = useMemo(
    () => (areaList ?? []).find((a) => a.id === selectedId) ?? null,
    [areaList, selectedId],
  )

  const handleSelect = (area: AreaInfo) => {
    setSelectedId(area.id)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="영역"
        icon={<MapPin size={15} />}
        variantPaths={{ a: '/area', b: '/area-b' }}
        actions={<AddButton onClick={() => undefined} />}
      />

      <div className="flex flex-1 overflow-hidden">
        <AreaListPane
          areas={filteredAreas}
          selectedId={selectedId}
          searchQuery={searchQuery}
          loading={isLoading}
          error={isError}
          onSearch={setSearchQuery}
          onSelect={handleSelect}
        />
        <AreaDrawer area={selectedArea} />
      </div>
    </div>
  )
}
