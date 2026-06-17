import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { MultiSelectToggleAllButton } from '@/components/basic/MultiSelectToggleAllButton'
import { Badge } from '@/components/primitive/Badge'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { SearchField } from '@/components/primitive/SearchField'
import { fallbackAccLvName } from '@/lib/app/entityDisplayLabels'

const FONT_SIZE = 15

export interface AccLvSelectItem {
  id: number
  name: string
  description?: string
  active?: boolean
}

interface AccLvSelectModalProps {
  open: boolean
  title?: string
  items: AccLvSelectItem[]
  selectedIds: number[]
  onCancel: () => void
  onConfirm: (ids: number[]) => void
}

const formatDescription = (description?: string): string => {
  const t = description?.trim() ?? ''
  return t !== '' ? t : '—'
}

export const AccLvSelectModal = ({
  open,
  title = '접근 권한 선택',
  items,
  selectedIds,
  onCancel,
  onConfirm,
}: AccLvSelectModalProps) => {
  const [query, setQuery] = useState('')
  const [checked, setChecked] = useState<Set<number>>(() => new Set(selectedIds))

  useEffect(() => {
    if (open) {
      setChecked(new Set(selectedIds))
      setQuery('')
    }
  }, [open, selectedIds])

  if (!open) return null

  const filtered = items.filter((item) => {
    if (!query.trim()) return true
    const q = query.trim().toLowerCase()
    return (
      item.name.toLowerCase().includes(q) ||
      (item.description?.toLowerCase().includes(q) ?? false)
    )
  })

  const toggle = (id: number) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAllFiltered = () => {
    setChecked(new Set(filtered.map((item) => item.id)))
  }

  const deselectAll = () => {
    setChecked(new Set())
  }

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
          width: 480,
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

        <div
          className="flex items-center gap-2 px-3 py-2 border-b"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <SearchField value={query} onChange={setQuery} />
          <MultiSelectToggleAllButton
            hasSelection={checked.size > 0}
            onSelectAll={selectAllFiltered}
            onDeselectAll={deselectAll}
            disabled={filtered.length === 0}
          />
        </div>

        {showColumnHeader ? (
          <div className="app-select-modal-header-row app-select-modal-acclv-grid">
            <span aria-hidden />
            <span className="app-select-modal-col-header">권한명</span>
            <span className="app-select-modal-col-header">설명</span>
            <span className="app-select-modal-col-header app-select-modal-col-header--center">
              상태
            </span>
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto app-scrollbar min-h-[200px] max-h-[40vh]">
          {filtered.length === 0 ? (
            <p
              className="text-center py-8"
              style={{ color: 'var(--color-text-subtle)', fontSize: FONT_SIZE }}
            >
              {query.trim() ? '검색 결과가 없습니다.' : '등록된 접근 권한이 없습니다.'}
            </p>
          ) : (
            filtered.map((item) => {
              const isActive = item.active !== false
              return (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className="app-select-modal-acclv-grid cursor-pointer border-b"
                  style={{
                    borderColor: 'var(--color-border-subtle)',
                    background: checked.has(item.id)
                      ? 'var(--color-accent-subtle)'
                      : 'transparent',
                  }}
                  onClick={() => toggle(item.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggle(item.id)
                    }
                  }}
                >
                  <Checkbox checked={checked.has(item.id)} readOnly />
                  <span className="app-select-modal-cell">
                    {fallbackAccLvName(item.name)}
                  </span>
                  <span
                    className="app-select-modal-cell app-select-modal-cell--muted"
                    title={formatDescription(item.description)}
                  >
                    {formatDescription(item.description)}
                  </span>
                  <span className="app-select-modal-cell app-select-modal-cell--center">
                    <Badge variant={isActive ? 'on' : 'off'}>
                      {isActive ? '활성' : '비활성'}
                    </Badge>
                  </span>
                </div>
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
            onClick={() => onConfirm(Array.from(checked))}
          >
            확인 ({checked.size})
          </Button>
        </div>
      </div>
    </div>
  )
}
