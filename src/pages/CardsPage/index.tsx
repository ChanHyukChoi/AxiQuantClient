import { useMemo, useState } from 'react'
import { CreditCard, Download, Plus, Printer, SlidersHorizontal } from 'lucide-react'
import { Grid } from '@/components/ui/Grid'
import { Button } from '@/components/ui/Button'
import { CardDrawer } from '@/pages/CardsPage/CardDrawer'
import { CreateCardModal } from '@/pages/CardsPage/CreateCardModal'
import { useCardColumns } from '@/pages/CardsPage/useCardColumns'
import { cardPrimaryKey, type CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'
import { useCardList } from '@/hooks/useCard'
import { useEmpList } from '@/hooks/useEmps'
import { useAccLvList } from '@/hooks/useAccLv'

export const CardsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data: cardList, isLoading: cardLoading } = useCardList()
  const { data: empList } = useEmpList()
  const { data: accLvList } = useAccLvList()

  const normalizedCards = useMemo<CardRow[]>(
    () =>
      cardList?.flatMap((c) => {
        const pk = cardPrimaryKey(c)
        if (pk === undefined) return []
        const normalized: CardRow = { ...c, cid: pk, id: pk }
        return [normalized]
      }) ?? [],
    [cardList],
  )

  const empNameMap = useMemo(() => {
    if (!empList) return {} as Record<number, string>
    return empList.reduce<Record<number, string>>((acc, emp) => {
      acc[emp.id] = emp.name
      return acc
    }, {})
  }, [empList])

  const accLvNameMap = useMemo(() => {
    if (!accLvList) return {} as Record<number, string>
    return accLvList.reduce<Record<number, string>>((acc, a) => {
      acc[a.id] = a.name
      return acc
    }, {})
  }, [accLvList])

  const filteredCards = useMemo(() => {
    if (!normalizedCards.length) return normalizedCards
    if (!searchQuery) return normalizedCards
    const q = searchQuery.toLowerCase()
    return normalizedCards.filter((c) => {
      const name = (c.name ?? '').toLowerCase()
      const num = c.cardNumber.toLowerCase()
      const emp =
        c.empId != null ? (empNameMap[c.empId] ?? c.empName ?? '').toLowerCase() : ''
      return name.includes(q) || num.includes(q) || emp.includes(q)
    })
  }, [normalizedCards, searchQuery, empNameMap])

  const selectedCard = useMemo(
    () => normalizedCards.find((c) => c.id === selectedId) ?? null,
    [normalizedCards, selectedId],
  )

  const columns = useCardColumns(empNameMap)

  const handleRowClick = (row: CardRow) => {
    if (editMode) setEditMode(false)
    setSelectedId(row.id)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <CreditCard style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
            카드
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="default" leftIcon={<Download size={12} />}>
           보내기
          </Button>
          <Button variant="default" leftIcon={<Printer size={12} />}>
            인쇄
          </Button>
          <Button variant="accent" leftIcon={<Plus size={12} />} onClick={() => setCreateModalOpen(true)}>
            추가
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Grid
          columns={columns}
          data={filteredCards}
          selectedId={selectedId ?? undefined}
          onRowClick={handleRowClick}
          searchPlaceholder="카드번호, 명칭, 사용자 검색..."
          onSearch={setSearchQuery}
          totalCount={filteredCards.length}
          loading={cardLoading}
          actions={
            <Button variant="default" size="sm" leftIcon={<SlidersHorizontal size={12} />}>
              필터
            </Button>
          }
        />
        <CardDrawer
          card={selectedCard}
          empList={empList ?? undefined}
          empNameMap={empNameMap}
          accLvNameMap={accLvNameMap}
          onDeleted={() => setSelectedId(null)}
          onEditModeChange={setEditMode}
        />
      </div>

      <CreateCardModal
        open={createModalOpen}
        empList={empList ?? undefined}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  )
}
