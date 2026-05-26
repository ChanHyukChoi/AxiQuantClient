import { useMemo, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import {
  AddButton,
  ExportButton,
  ImportButton,
  PrintButton,
  FilterButton,
} from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
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
      <PageHeader
        title="카드"
        icon={<CreditCard size={15} />}
        actions={
          <>
            <ImportButton />
            <ExportButton />
            <PrintButton />
            <AddButton onClick={() => setCreateModalOpen(true)} />
          </>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        <Grid
          columns={columns}
          data={filteredCards}
          selectedId={selectedId ?? undefined}
          onRowClick={handleRowClick}
          onSearch={setSearchQuery}
          totalCount={filteredCards.length}
          loading={cardLoading}
          actions={<FilterButton />}
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
