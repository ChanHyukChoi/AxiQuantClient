import { useMemo, useState } from 'react'
import { MapPin } from 'lucide-react'
import { AreaDrawer } from '@/pages/AreaPage/AreaDrawer'
import { AreaListPane } from '@/pages/AreaPage/AreaListPane'
import { useAreas } from '@/hooks/useArea'
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
      <div
        className="flex items-center flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <MapPin style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            영역
          </span>
        </div>
      </div>

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
