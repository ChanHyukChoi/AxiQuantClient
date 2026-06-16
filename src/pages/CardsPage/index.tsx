import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/query/queryKeys'
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
import { empDisplayName } from '@/lib/mappers/empsMappers'
import { useCardList } from '@/hooks/api/useCard'
import { useEmpList } from '@/hooks/api/useEmps'
import { useAccLvList } from '@/hooks/api/useAccLv'
import { useAreas } from '@/hooks/api/useArea'

/** v3: 사용자 사진 컬럼·empId 너비 조정 — 이전 localStorage와 분리 */
const CARDS_GRID_LAYOUT_KEY = 'axiquant.grid.layout.cards.v3'
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
  const qc = useQueryClient()
  const selectionBeforeCreateRef = useRef<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [listFilters, setListFilters] = useState(defaultCardListFilters)
  const [optionsModalOpen, setOptionsModalOpen] = useState(false)
  const [optionsModalTab, setOptionsModalTab] = useState<'filter' | 'columns'>('filter')
  const [createMode, setCreateMode] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data: cardList, isLoading: cardLoading } = useCardList()
  const { data: empList, isLoading: empLoading } = useEmpList()
  const { data: accLvList, isLoading: accLvLoading } = useAccLvList()
  const { data: areaList } = useAreas()

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

  useEffect(() => {
    if (!import.meta.env.DEV) return
    const cardRawCount = Array.isArray(cardList)
      ? cardList.length
      : cardList == null
        ? null
        : 'not-array'
    const empRawCount = Array.isArray(empList)
      ? empList.length
      : empList == null
        ? null
        : 'not-array'
    const accLvRawCount = Array.isArray(accLvList)
      ? accLvList.length
      : accLvList == null
        ? null
        : 'not-array'
    console.info('[CardsPage] Drawer 참조 데이터 (카드·카드사용자·접근권한)', {
      카드목록: {
        loading: cardLoading,
        apiCount: cardRawCount,
        gridCount: normalizedCards.length,
        droppedWithoutPrimaryKey: Array.isArray(cardList)
          ? cardList.length - normalizedCards.length
          : null,
      },
      카드사용자_직원: {
        loading: empLoading,
        apiCount: empRawCount,
        note: '카드 사용자 선택 모달에 사용 (/api/emps)',
      },
      접근권한: {
        loading: accLvLoading,
        apiCount: accLvRawCount,
        note: '접근권한 선택 모달에 사용 (/api/acclv)',
      },
      filters: listFilters,
      searchQuery: searchQuery || '(없음)',
    })
  }, [
    cardList,
    cardLoading,
    empList,
    empLoading,
    accLvList,
    accLvLoading,
    normalizedCards.length,
    listFilters,
    searchQuery,
  ])

  const empNameMap = useMemo(() => {
    if (!Array.isArray(empList)) return {} as Record<number, string>
    return empList.reduce<Record<number, string>>((acc, emp) => {
      if (emp.id <= 0) return acc
      const label = empDisplayName(emp)
      if (label) acc[emp.id] = label
      return acc
    }, {})
  }, [empList])

  const empPhotoById = useMemo(() => {
    if (!Array.isArray(empList)) return {} as Record<number, string | undefined>
    return empList.reduce<Record<number, string | undefined>>((acc, emp) => {
      if (emp.id > 0) acc[emp.id] = emp.photoUrl
      return acc
    }, {})
  }, [empList])

  const accLvNameMap = useMemo(() => {
    if (!Array.isArray(accLvList)) return {} as Record<number, string>
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

  useEffect(() => {
    setPage(1)
  }, [searchQuery, listFilters])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const selectedCard = useMemo(
    () => normalizedCards.find((c) => c.id === selectedId) ?? null,
    [normalizedCards, selectedId],
  )

  const baseColumns = useCardColumns(empNameMap, empPhotoById)
  const {
    columns,
    columnOptions,
    minGridWidth,
    setColumnWidth,
    moveColumn,
    setColumnVisible,
    resetLayout,
  } = useGridLayout(baseColumns, {
    storageKey: CARDS_GRID_LAYOUT_KEY,
    legacyWidthsKey: CARDS_GRID_LEGACY_WIDTHS_KEY,
  })

  const handleRowClick = (row: CardRow) => {
    if (createMode) {
      setCreateMode(false)
      selectionBeforeCreateRef.current = null
    }
    if (editMode) setEditMode(false)
    setSelectedId(row.id)
  }

  const handleAddClick = () => {
    selectionBeforeCreateRef.current = selectedId
    setCreateMode(true)
    setEditMode(false)
    setSelectedId(null)
  }

  const handleCreateCancel = () => {
    setCreateMode(false)
    setSelectedId(selectionBeforeCreateRef.current)
    selectionBeforeCreateRef.current = null
  }

  const handleCardCreated = async (id: number) => {
    setCreateMode(false)
    setSelectedId(id)
    selectionBeforeCreateRef.current = null
    await qc.refetchQueries({ queryKey: queryKeys.card.all })
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
            searchPlaceholder="카드 번호, 사용자 검색..."
            onSearch={setSearchQuery}
            totalCount={filteredCards.length}
            loading={cardLoading}
            pagination={{
              page,
              pageSize,
              onPageChange: setPage,
              onPageSizeChange: handlePageSizeChange,
            }}
            resizableColumns
            onColumnWidthChange={setColumnWidth}
            reorderableColumns
            onColumnReorder={moveColumn}
            actions={
              <FilterButton
                showLabel={false}
                title="필터"
                active={isCardFiltersActive(listFilters)}
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
            areaList={areaList ?? undefined}
            onCreateCancel={handleCreateCancel}
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
