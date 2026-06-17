import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { SearchField } from '@/components/primitive/SearchField'
import { fallbackEmpName } from '@/lib/app/entityDisplayLabels'

const FONT_SIZE = 15

export interface EmpSelectItem {
  id: number
  name: string
  udef?: string
  dept?: number
  lv?: number
}

interface EmpSelectModalProps {
  open: boolean
  title?: string
  emps: EmpSelectItem[]
  selectedId: number | undefined
  allowClear?: boolean
  clearLabel?: string
  onCancel: () => void
  onConfirm: (id: number | undefined) => void
}

const formatEmpNo = (udef?: string): string => {
  const t = udef?.trim() ?? ''
  if (!t || t === '{}') return '—'
  return t
}

const formatNumCell = (n: number | undefined): string => {
  const v = n ?? 0
  return Number.isFinite(v) && v !== 0 ? String(v) : '—'
}

const RadioMark = ({ checked }: { checked: boolean }) => (
  <span
    className="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center"
    style={{
      borderColor: checked ? 'var(--color-accent)' : 'var(--color-border)',
    }}
  >
    {checked ? (
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
    ) : null}
  </span>
)

export const EmpSelectModal = ({
  open,
  title = '카드 사용자 선택',
  emps,
  selectedId,
  allowClear = true,
  clearLabel = '선택 안 함',
  onCancel,
  onConfirm,
}: EmpSelectModalProps) => {
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState<number | undefined>(selectedId)

  useEffect(() => {
    if (open) {
      setPicked(selectedId)
      setQuery('')
    }
  }, [open, selectedId])

  if (!open) return null

  const filtered = emps.filter((emp) => {
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return (
      emp.name.toLowerCase().includes(q) ||
      formatEmpNo(emp.udef).toLowerCase().includes(q) ||
      String(emp.dept ?? '').includes(q)
    )
  })

  const showColumnHeader = filtered.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex flex-col rounded-md overflow-hidden"
        style={{
          width: 400,
          maxHeight: '70vh',
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2.5 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span
            className="font-medium"
            style={{ color: 'var(--color-text)', fontSize: FONT_SIZE }}
          >
            {title}
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer"
            style={{ color: 'var(--color-icon)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-3 py-2 border-b w-full min-w-0" style={{ borderColor: 'var(--color-border)' }}>
          <SearchField value={query} onChange={setQuery} />
        </div>

        {showColumnHeader ? (
          <div
            className="app-select-modal-header-row app-select-modal-emp-grid"
            style={{ borderColor: 'var(--color-border-subtle)' }}
          >
            <span aria-hidden />
            <span className="app-select-modal-col-header">이름</span>
            <span className="app-select-modal-col-header">사번</span>
            <span className="app-select-modal-col-header app-select-modal-col-header--center">
              부서
            </span>
            <span className="app-select-modal-col-header app-select-modal-col-header--center">
              직급
            </span>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto app-scrollbar min-h-[200px] max-h-[40vh]">
          {allowClear ? (
            <button
              type="button"
              onClick={() => setPicked(undefined)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 cursor-pointer border-b text-left"
              style={{
                borderColor: 'var(--color-border-subtle)',
                background: picked === undefined ? 'var(--color-accent-subtle)' : 'transparent',
              }}
            >
              <RadioMark checked={picked === undefined} />
              <span style={{ color: 'var(--color-text-muted)', fontSize: FONT_SIZE }}>
                {clearLabel}
              </span>
            </button>
          ) : null}

          {filtered.length === 0 ? (
            <p
              className="text-center py-8"
              style={{ color: 'var(--color-text-subtle)', fontSize: FONT_SIZE }}
            >
              {query.trim() ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
            </p>
          ) : (
            filtered.map((emp, index) => {
              const isPicked = picked === emp.id
              return (
                <button
                  key={emp.id > 0 ? emp.id : `emp-row-${index}`}
                  type="button"
                  onClick={() => setPicked(emp.id)}
                  className="app-select-modal-emp-grid w-full cursor-pointer border-b text-left"
                  style={{
                    borderColor: 'var(--color-border-subtle)',
                    background: isPicked ? 'var(--color-accent-subtle)' : 'transparent',
                  }}
                >
                  <RadioMark checked={isPicked} />
                  <span className="app-select-modal-cell">
                    {fallbackEmpName(emp.name)}
                  </span>
                  <span className="app-select-modal-cell">
                    {formatEmpNo(emp.udef)}
                  </span>
                  <span className="app-select-modal-cell app-select-modal-cell--center">
                    {formatNumCell(emp.dept)}
                  </span>
                  <span className="app-select-modal-cell app-select-modal-cell--center">
                    {formatNumCell(emp.lv)}
                  </span>
                </button>
              )
            })
          )}
        </div>

        <div
          className="flex justify-end gap-2 p-3 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <Button variant="default" size="md" onClick={onCancel}>
            취소
          </Button>
          <Button
            variant="accent"
            size="md"
            leftIcon={<Check size={15} />}
            onClick={() => onConfirm(picked)}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
