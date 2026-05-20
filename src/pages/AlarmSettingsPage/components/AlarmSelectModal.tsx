import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { SearchField } from '@/components/primitive/SearchField'
import type { AlarmInfo } from '@/types/api'

interface AlarmSelectModalProps {
  open: boolean
  alarms: AlarmInfo[]
  selectedIds: number[]
  onCancel: () => void
  onConfirm: (ids: number[]) => void
}

export const AlarmSelectModal = ({
  open,
  alarms,
  selectedIds,
  onCancel,
  onConfirm,
}: AlarmSelectModalProps) => {
  const [query, setQuery] = useState('')
  const [checked, setChecked] = useState<Set<number>>(() => new Set(selectedIds))

  useEffect(() => {
    if (open) setChecked(new Set(selectedIds))
  }, [open, selectedIds])

  if (!open) return null

  const filtered = alarms.filter((a) => {
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return a.name.toLowerCase().includes(q) || String(a.id).includes(q)
  })

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onCancel}
      role="presentation"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
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
          <span
            className="text-[13px] font-medium"
            style={{ color: 'var(--color-text)' }}
          >
            경보 선택
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

        <div
          className="px-3 py-2 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <SearchField
            placeholder="경보 검색..."
            value={query}
            onChange={setQuery}
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto app-scrollbar min-h-[200px] max-h-[40vh]">
          {filtered.length === 0 ? (
            <p
              className="text-[12px] text-center py-8"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              {query.trim() ? '검색 결과가 없습니다.' : '등록된 경보가 없습니다.'}
            </p>
          ) : (
            filtered.map((alarm) => (
              <label
                key={alarm.id}
                className="flex items-center gap-2.5 px-3.5 py-2 cursor-pointer border-b"
                style={{ borderColor: 'var(--color-border-subtle)' }}
              >
                <input
                  type="checkbox"
                  checked={checked.has(alarm.id)}
                  onChange={() => toggle(alarm.id)}
                />
                <span
                  className="text-[12px] flex-1 truncate"
                  style={{ color: 'var(--color-text)' }}
                >
                  {alarm.name || `경보 #${alarm.id}`}
                </span>
              </label>
            ))
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
            onClick={() => onConfirm(Array.from(checked))}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  )
}
