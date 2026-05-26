import { useEffect, useState } from 'react'
import { Button } from '@/components/primitive/Button'

export type EmpListFilters = {
  cardAssignment: 'all' | 'has' | 'none'
}

export const defaultEmpListFilters: EmpListFilters = {
  cardAssignment: 'all',
}

export const isEmpFiltersActive = (filters: EmpListFilters): boolean =>
  filters.cardAssignment !== 'all'

const selectClass =
  'w-full text-[12px] px-2 py-1 rounded border outline-none'

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

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="rounded-md p-5 min-w-[280px] max-w-[320px] w-full"
        style={{
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
      >
        <p
          className="text-[13px] font-medium mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          카드 사용자 필터
        </p>

        <label className="flex flex-col gap-1">
          <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
            보유 카드
          </span>
          <select
            value={draft.cardAssignment}
            onChange={(e) =>
              setDraft({
                cardAssignment: e.target.value as EmpListFilters['cardAssignment'],
              })
            }
            className={selectClass}
            style={{
              background: 'var(--color-input-bg)',
              borderColor: 'var(--color-input-border)',
              color: 'var(--color-text)',
            }}
          >
            <option value="all">전체</option>
            <option value="has">카드 있음</option>
            <option value="none">카드 없음</option>
          </select>
        </label>

        <div className="flex justify-end gap-2 mt-5">
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
        </div>
      </div>
    </div>
  )
}
