import { useMemo, useState } from 'react'
import { CreditCard } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import {
  AddButton,
  ExportButton,
  ImportButton,
  PrintButton,
  FilterButton,
} from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { useGridLayout } from '@/hooks/ui/useGridLayout'
import { CardDrawer } from '@/pages/CardsPage/CardDrawer'
import {
  CardListOptionsModal,
  defaultCardListFilters,
  isCardFiltersActive,
  type CardListFilters,
} from '@/pages/CardsPage/components/CardListOptionsModal'
import { useCardColumns } from '@/pages/CardsPage/useCardColumns'
import {
  cardPrimaryKey,
  cardStatusLabel,
  cardTypeLabel,
  type CardRow,
} from '@/pages/CardsPage/utils/cardPageHelpers'
import { useCardList } from '@/hooks/api/useCard'
import { useEmpList } from '@/hooks/api/useEmps'
import { useAccLvList } from '@/hooks/api/useAccLv'

const CARDS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.cards'
const CARDS_GRID_LEGACY_WIDTHS_KEY = 'axiquant.grid.columns.cards'

const applyCardFilters = (cards: CardRow[], filters: CardListFilters): CardRow[] =>
  cards.filter((c) => {
    if (filters.status !== 'all' && cardStatusLabel(c) !== filters.status) return false
    if (filters.type !== 'all' && cardTypeLabel(c) !== filters.type) return false
    if (filters.assignment === 'assigned' && c.empId == null) return false
    if (filters.assignment === 'unassigned' && c.empId != null) return false
    return true
  })

export const CardsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [listFilters, setListFilters] = useState(defaultCardListFilters)
  const [optionsModalOpen, setOptionsModalOpen] = useState(false)
  const [optionsModalTab, setOptionsModalTab] = useState<'filter' | 'columns'>('filter')
  const [createMode, setCreateMode] = useState(false)

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

  const cardTypeOptions = useMemo(() => {
    const set = new Set<string>()
    for (const c of normalizedCards) set.add(cardTypeLabel(c))
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'ko'))
  }, [normalizedCards])

  const filteredCards = useMemo(() => {
    let rows = normalizedCards
    rows = applyCardFilters(rows, listFilters)
    if (!searchQuery) return rows
    const q = searchQuery.toLowerCase()
    return rows.filter((c) => {
      const name = (c.name ?? '').toLowerCase()
      const num = c.cardNumber.toLowerCase()
      const emp =
        c.empId != null ? (empNameMap[c.empId] ?? c.empName ?? '').toLowerCase() : ''
      return name.includes(q) || num.includes(q) || emp.includes(q)
    })
  }, [normalizedCards, listFilters, searchQuery, empNameMap])

  const selectedCard = useMemo(
    () => normalizedCards.find((c) => c.id === selectedId) ?? null,
    [normalizedCards, selectedId],
  )

  const baseColumns = useCardColumns(empNameMap)
  const {
    columns,
    columnOptions,
    minGridWidth,
    isLayoutCustomized,
    setColumnWidth,
    moveColumn,
    setColumnVisible,
    resetLayout,
  } = useGridLayout(baseColumns, {
    storageKey: CARDS_GRID_LAYOUT_KEY,
    legacyWidthsKey: CARDS_GRID_LEGACY_WIDTHS_KEY,
  })

  const optionsActive = isCardFiltersActive(listFilters) || isLayoutCustomized

  const handleRowClick = (row: CardRow) => {
    if (createMode) setCreateMode(false)
    if (editMode) setEditMode(false)
    setSelectedId(row.id)
  }

  const handleAddClick = () => {
    setCreateMode(true)
    setEditMode(false)
    setSelectedId(null)
  }

  const handleCardCreated = (id: number) => {
    setSelectedId(id)
  }

  const openOptions = (tab: 'filter' | 'columns') => {
    setOptionsModalTab(tab)
    setOptionsModalOpen(true)
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
            <AddButton onClick={handleAddClick} />
          </>
        }
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={320}
        defaultDrawerWidth={400}
        storageKey="axiquant.drawer.cards"
        main={
          <Grid
            columns={columns}
            data={filteredCards}
            selectedId={selectedId ?? undefined}
            onRowClick={handleRowClick}
            onSearch={setSearchQuery}
            totalCount={filteredCards.length}
            loading={cardLoading}
            resizableColumns
            onColumnWidthChange={setColumnWidth}
            reorderableColumns
            onColumnReorder={moveColumn}
            actions={
              <FilterButton
                active={optionsActive}
                onClick={() => openOptions('filter')}
              />
            }
          />
        }
        drawer={
          <CardDrawer
            card={selectedCard}
            createMode={createMode}
            empList={empList ?? undefined}
            empNameMap={empNameMap}
            accLvNameMap={accLvNameMap}
            accLvList={accLvList ?? undefined}
            onCreateModeChange={setCreateMode}
            onCreated={handleCardCreated}
            onDeleted={() => setSelectedId(null)}
            onEditModeChange={setEditMode}
          />
        }
      />

      <CardListOptionsModal
        open={optionsModalOpen}
        initialTab={optionsModalTab}
        filters={listFilters}
        typeOptions={cardTypeOptions}
        columnOptions={columnOptions}
        onApplyFilters={setListFilters}
        onColumnVisibleChange={setColumnVisible}
        onResetLayout={resetLayout}
        onClose={() => setOptionsModalOpen(false)}
      />

    </div>
  )
}
