import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { BadgeCheck } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/patterns/SplitDrawerLayout'
import { AddButton, ExportButton, FilterButton, PrintButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { queryKeys } from '@/lib/query/queryKeys'
import { sumColumnWidths } from '@/lib/layout/columnWidths'
import { EmpDrawer } from '@/pages/EmpsPage/EmpDrawer'
import {
  defaultEmpListFilters,
  EmpFilterModal,
  isEmpFiltersActive,
  type EmpListFilters,
} from '@/pages/EmpsPage/components/EmpFilterModal'
import { useEmpColumns } from '@/pages/EmpsPage/useEmpColumns'
import { useCardList } from '@/hooks/api/useCard'
import { useEmpList } from '@/hooks/api/useEmps'
import type { EmpInfo } from '@/types/api'

const applyEmpFilters = (
  emps: EmpInfo[],
  filters: EmpListFilters,
  cardCountMap: Record<number, number>,
): EmpInfo[] => {
  if (filters.cardAssignment === 'all') return emps
  return emps.filter((emp) => {
    const count = cardCountMap[emp.id] ?? 0
    if (filters.cardAssignment === 'has') return count > 0
    return count === 0
  })
}

export const EmpsPage = () => {
  const { t } = useTranslation(['nav', 'common', 'emp'])
  const qc = useQueryClient()
  const selectionBeforeCreateRef = useRef<number | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [listFilters, setListFilters] = useState(defaultEmpListFilters)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [createMode, setCreateMode] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  const { data: empList, isLoading: empLoading } = useEmpList()
  const { data: cardList } = useCardList()

  const selectedEmp = useMemo(
    () => empList?.find((e) => e.id === selectedId) ?? null,
    [empList, selectedId],
  )

  const empCardCountMap = useMemo(() => {
    if (!cardList) return {} as Record<number, number>
    return cardList.reduce<Record<number, number>>((acc, card) => {
      if (card.empId != null) {
        acc[card.empId] = (acc[card.empId] ?? 0) + 1
      }
      return acc
    }, {})
  }, [cardList])

  const filteredEmps = useMemo(() => {
    if (!empList) return []
    let rows = applyEmpFilters(empList, listFilters, empCardCountMap)
    if (!searchQuery) return rows
    const q = searchQuery.toLowerCase()
    return rows.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.udef.toLowerCase().includes(q) ||
        String(emp.dept).includes(q),
    )
  }, [empList, listFilters, empCardCountMap, searchQuery])

  useEffect(() => {
    setPage(1)
  }, [searchQuery, listFilters])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1)
  }, [])

  const selectedCards = useMemo(
    () => cardList?.filter((c) => c.empId === selectedId) ?? [],
    [cardList, selectedId],
  )

  const columns = useEmpColumns(empCardCountMap)
  const minGridWidth = useMemo(() => sumColumnWidths(columns), [columns])

  const handleRowClick = (emp: EmpInfo) => {
    if (createMode) {
      setCreateMode(false)
      selectionBeforeCreateRef.current = null
    }
    if (editMode) setEditMode(false)
    setSelectedId(emp.id)
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

  const handleEmpCreated = async (id: number | null) => {
    setCreateMode(false)
    if (id != null) setSelectedId(id)
    selectionBeforeCreateRef.current = null
    await qc.refetchQueries({ queryKey: queryKeys.emps.all })
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title={t('nav:menu.emps')}
        icon={<BadgeCheck size={15} />}
        actions={
          <>
            <ExportButton />
            <PrintButton />
            <AddButton onClick={handleAddClick} />
          </>
        }
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        main={
          <Grid
            columns={columns}
            data={filteredEmps}
            selectedId={selectedId ?? undefined}
            onRowClick={handleRowClick}
            searchPlaceholder={t('emp:searchPlaceholder')}
            onSearch={setSearchQuery}
            totalCount={filteredEmps.length}
            loading={empLoading}
            pagination={{
              page,
              pageSize,
              onPageChange: setPage,
              onPageSizeChange: handlePageSizeChange,
            }}
            actions={
              <FilterButton
                showLabel={false}
                title={t('common:filter')}
                active={isEmpFiltersActive(listFilters)}
                onClick={() => setFilterModalOpen(true)}
              />
            }
          />
        }
        drawer={
          <EmpDrawer
            emp={selectedEmp}
            createMode={createMode}
            selectedCards={selectedCards}
            onCreateCancel={handleCreateCancel}
            onCreated={handleEmpCreated}
            onDeleted={() => setSelectedId(null)}
            onEditModeChange={setEditMode}
          />
        }
      />

      <EmpFilterModal
        open={filterModalOpen}
        filters={listFilters}
        onApply={setListFilters}
        onClose={() => setFilterModalOpen(false)}
      />
    </div>
  )
}
