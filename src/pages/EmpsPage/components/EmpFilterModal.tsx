import { useEffect, useState } from 'react'
import { Button } from '@/components/primitive/Button'
import { Select } from '@/components/primitive/Select'
import {
  LIST_OPTIONS_FONT_SIZE,
  ListOptionsFilterField,
  ListOptionsModalShell,
} from '@/components/basic/ListOptionsModalShell'

export type EmpListFilters = {
  cardAssignment: 'all' | 'has' | 'none'
}

export const defaultEmpListFilters: EmpListFilters = {
  cardAssignment: 'all',
}

export const isEmpFiltersActive = (filters: EmpListFilters): boolean =>
  filters.cardAssignment !== 'all'

const FILTER_TAB = { id: 'filter', label: '데이터 필터' } as const

interface EmpFilterModalProps {
  open: boolean
  filters: EmpListFilters
  onApply: (filters: EmpListFilters) => void
  onClose: () => void
}

export const EmpFilterModal = ({
  open,
  filters,
  onApply,
  onClose,
}: EmpFilterModalProps) => {
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  return (
    <ListOptionsModalShell
      open={open}
      tabs={[FILTER_TAB]}
      activeTab={FILTER_TAB.id}
      onTabChange={() => undefined}
      onClose={onClose}
      footer={
        <>
          <Button
            variant="default"
            size="md"
            onClick={() => {
              setDraft(defaultEmpListFilters)
              onApply(defaultEmpListFilters)
              onClose()
            }}
          >
            초기화
          </Button>
          <Button variant="default" size="md" onClick={onClose}>
            취소
          </Button>
          <Button
            variant="accent"
            size="md"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
          >
            적용
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <ListOptionsFilterField label="보유 카드">
          <Select
            value={draft.cardAssignment}
            fontSize={LIST_OPTIONS_FONT_SIZE}
            onChange={(v) =>
              setDraft({
                cardAssignment: v as EmpListFilters['cardAssignment'],
              })
            }
            options={[
              { value: 'all', label: '전체' },
              { value: 'has', label: '카드 있음' },
              { value: 'none', label: '카드 없음' },
            ]}
          />
        </ListOptionsFilterField>
      </div>
    </ListOptionsModalShell>
  )
}
