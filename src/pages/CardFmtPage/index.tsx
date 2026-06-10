import { useMemo, useState } from 'react'
import { Binary } from 'lucide-react'
import { PageHeader } from '@/layouts/PageHeader'
import { AddButton } from '@/components/page-actions'
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
      <PageHeader
        title="카드 형식 (1안)"
        icon={<Binary size={15} style={{ color: '#7f77dd' }} />}
        actions={<AddButton onClick={() => undefined} title="추가 — 준비 중" />}
      />

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
