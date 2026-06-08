import { useMemo, useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { SplitDrawerLayout } from '@/components/layout/SplitDrawerLayout'
import { AddButton, ExportButton, FilterButton, PrintButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { sumColumnWidths } from '@/lib/layout/columnWidths'
import { CreateEmpModal } from '@/pages/EmpsPage/CreateEmpModal'
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
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [listFilters, setListFilters] = useState(defaultEmpListFilters)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [createModalOpen, setCreateModalOpen] = useState(false)

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

  const selectedCards = useMemo(
    () => cardList?.filter((c) => c.empId === selectedId) ?? [],
    [cardList, selectedId],
  )

  const columns = useEmpColumns(empCardCountMap)
  const minGridWidth = useMemo(() => sumColumnWidths(columns), [columns])

  const handleRowClick = (emp: EmpInfo) => {
    if (editMode) setEditMode(false)
    setSelectedId(emp.id)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <PageHeader
        title="카드 사용자"
        icon={<BadgeCheck size={15} />}
        actions={
          <>
            <ExportButton />
            <PrintButton />
            <AddButton onClick={() => setCreateModalOpen(true)} />
          </>
        }
      />

      <SplitDrawerLayout
        minMainWidth={minGridWidth}
        minDrawerWidth={300}
        defaultDrawerWidth={380}
        storageKey="axiquant.drawer.emps"
        main={
          <Grid
            columns={columns}
            data={filteredEmps}
            selectedId={selectedId ?? undefined}
            onRowClick={handleRowClick}
            searchPlaceholder="이름, 사번, 부서 검색..."
            onSearch={setSearchQuery}
            totalCount={filteredEmps.length}
            loading={empLoading}
            actions={
              <FilterButton
                active={isEmpFiltersActive(listFilters)}
                onClick={() => setFilterModalOpen(true)}
              />
            }
          />
        }
        drawer={
          <EmpDrawer
            emp={selectedEmp}
            selectedCards={selectedCards}
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

      <CreateEmpModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  )
}
