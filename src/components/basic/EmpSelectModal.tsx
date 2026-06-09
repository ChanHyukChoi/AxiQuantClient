import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { SearchField } from '@/components/primitive/SearchField'

export interface EmpSelectItem {
  id: number
  name: string
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
    return emp.name.toLowerCase().includes(q) || String(emp.id).includes(q)
  })

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
          width: 380,
          maxHeight: '70vh',
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
      >
        <div
          className="flex items-center justify-between px-3 py-2.5 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
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

        <div className="px-3 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <SearchField value={query} onChange={setQuery} />
        </div>

        <div className="flex-1 overflow-y-auto app-scrollbar min-h-[200px] max-h-[40vh]">
          {allowClear && (
            <button
              type="button"
              onClick={() => setPicked(undefined)}
              className="flex items-center gap-2.5 w-full px-3.5 py-2 cursor-pointer border-b text-left"
              style={{
                borderColor: 'var(--color-border-subtle)',
                background: picked === undefined ? 'var(--color-accent-subtle)' : 'transparent',
              }}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center"
                style={{
                  borderColor: picked === undefined ? 'var(--color-accent)' : 'var(--color-border)',
                }}
              >
                {picked === undefined ? (
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--color-accent)' }}
                  />
                ) : null}
              </span>
              <span className="text-[12px] flex-1" style={{ color: 'var(--color-text-muted)' }}>
                {clearLabel}
              </span>
            </button>
          )}

          {filtered.length === 0 ? (
            <p
              className="text-[12px] text-center py-8"
              style={{ color: 'var(--color-text-subtle)' }}
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
                  className="flex items-center gap-2.5 w-full px-3.5 py-2 cursor-pointer border-b text-left"
                  style={{
                    borderColor: 'var(--color-border-subtle)',
                    background: isPicked ? 'var(--color-accent-subtle)' : 'transparent',
                  }}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border flex-shrink-0 flex items-center justify-center"
                    style={{
                      borderColor: isPicked ? 'var(--color-accent)' : 'var(--color-border)',
                    }}
                  >
                    {isPicked ? (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: 'var(--color-accent)' }}
                      />
                    ) : null}
                  </span>
                  <span
                    className="text-[12px] flex-1 truncate"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {emp.name || `사용자 #${emp.id}`}
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
            leftIcon={<Check size={12} />}
            onClick={() => onConfirm(picked)}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
