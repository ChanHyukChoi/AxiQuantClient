import { useMemo, useState } from 'react'
import { BadgeCheck, SlidersHorizontal } from 'lucide-react'
import { Grid } from '@/components/primitive/Grid'
import { Button } from '@/components/primitive/Button'
import { AddButton, ExportButton, PrintButton } from '@/components/page-actions'
import { PageHeader } from '@/layouts/PageHeader'
import { CreateEmpModal } from '@/pages/EmpsPage/CreateEmpModal'
import { EmpDrawer } from '@/pages/EmpsPage/EmpDrawer'
import { useEmpColumns } from '@/pages/EmpsPage/useEmpColumns'
import { useCardList } from '@/hooks/useCard'
import { useEmpList } from '@/hooks/useEmps'
import type { EmpInfo } from '@/types/api'

export const EmpsPage = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const { data: empList, isLoading: empLoading } = useEmpList()
  const { data: cardList } = useCardList()

  const selectedEmp = useMemo(
    () => empList?.find((e) => e.id === selectedId) ?? null,
    [empList, selectedId],
  )

  const filteredEmps = useMemo(() => {
    if (!empList) return []
    if (!searchQuery) return empList
    const q = searchQuery.toLowerCase()
    return empList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.udef.toLowerCase().includes(q) ||
        String(emp.dept).includes(q),
    )
  }, [empList, searchQuery])

  const empCardCountMap = useMemo(() => {
    if (!cardList) return {} as Record<number, number>
    return cardList.reduce<Record<number, number>>((acc, card) => {
      if (card.empId != null) {
        acc[card.empId] = (acc[card.empId] ?? 0) + 1
      }
      return acc
    }, {})
  }, [cardList])

  const selectedCards = useMemo(
    () => cardList?.filter((c) => c.empId === selectedId) ?? [],
    [cardList, selectedId],
  )

  const columns = useEmpColumns(empCardCountMap)

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

      <div className="flex flex-1 overflow-hidden">
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
            <Button
              variant="default"
              size="sm"
              leftIcon={<SlidersHorizontal size={12} />}
            >
              필터
            </Button>
          }
        />
        <EmpDrawer
          emp={selectedEmp}
          selectedCards={selectedCards}
          onDeleted={() => setSelectedId(null)}
          onEditModeChange={setEditMode}
        />
      </div>

      <CreateEmpModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </div>
  )
}
