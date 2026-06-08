import { useMemo, useState } from 'react'
import { Binary } from 'lucide-react'
import { CardFmtDrawer } from '@/pages/CardFmtPage/CardFmtDrawer'
import { CardFmtListPane } from '@/pages/CardFmtPage/CardFmtListPane'
import { useCardFmts } from '@/hooks/api/useCardfmt'
import type { CardfmtInfo } from '@/types/api'

export const CardFmtPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: cardfmtList, isLoading, isError } = useCardFmts()

  const filteredItems = useMemo(() => {
    const list = cardfmtList ?? []
    if (!searchQuery.trim()) return list
    const q = searchQuery.trim().toLowerCase()
    return list.filter((item) => item.name.toLowerCase().includes(q))
  }, [cardfmtList, searchQuery])

  const selectedCardfmt = useMemo(
    () => (cardfmtList ?? []).find((item) => item.id === selectedId) ?? null,
    [cardfmtList, selectedId],
  )

  const handleSelect = (item: CardfmtInfo) => {
    setSelectedId(item.id)
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
          <Binary style={{ width: 15, height: 15, color: '#7f77dd' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            카드 형식
          </span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <CardFmtListPane
          items={filteredItems}
          selectedId={selectedId}
          searchQuery={searchQuery}
          loading={isLoading}
          error={isError}
          onSearch={setSearchQuery}
          onSelect={handleSelect}
        />
        <CardFmtDrawer cardfmt={selectedCardfmt} />
      </div>
    </div>
  )
}
