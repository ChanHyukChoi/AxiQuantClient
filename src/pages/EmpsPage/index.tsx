import { useMemo, useState } from 'react'
import { BadgeCheck, Download, Plus, Printer, SlidersHorizontal } from 'lucide-react'
import { Grid } from '@/components/ui/Grid'
import { Button } from '@/components/ui/Button'
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
      <div
        className="flex items-center justify-between flex-shrink-0 px-3"
        style={{
          height: 42,
          background: 'var(--color-sidebar)',
          borderBottom: '0.5px solid var(--color-border)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <BadgeCheck style={{ width: 15, height: 15, color: 'var(--color-accent)' }} />
          <span className="text-base font-medium" style={{ color: 'var(--color-text)' }}>
            카드 사용자
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button variant="default" leftIcon={<Download size={12} />}>
            보내기
          </Button>
          <Button variant="default" leftIcon={<Printer size={12} />}>
            인쇄
          </Button>
          <Button
            variant="accent"
            leftIcon={<Plus size={12} />}
            onClick={() => setCreateModalOpen(true)}
          >
            추가
          </Button>
        </div>
      </div>

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
