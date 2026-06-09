import { useEffect, useState } from 'react'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Select } from '@/components/primitive/Select'
import type { GridColumnOption } from '@/hooks/ui/useGridLayout'

export type CardListFilters = {
  status: 'all' | '활성' | '비활성'
  type: 'all' | string
  assignment: 'all' | 'assigned' | 'unassigned'
}

export const defaultCardListFilters: CardListFilters = {
  status: 'all',
  type: 'all',
  assignment: 'all',
}

export const isCardFiltersActive = (filters: CardListFilters): boolean =>
  filters.status !== 'all' ||
  filters.type !== 'all' ||
  filters.assignment !== 'all'

type OptionsTab = 'filter' | 'columns'

interface CardListOptionsModalProps {
  open: boolean
  initialTab?: OptionsTab
  filters: CardListFilters
  typeOptions: string[]
  columnOptions: GridColumnOption[]
  onApplyFilters: (filters: CardListFilters) => void
  onColumnVisibleChange: (key: string, visible: boolean) => void
  onResetLayout: () => void
  onClose: () => void
}

export const CardListOptionsModal = ({
  open,
  initialTab = 'filter',
  filters,
  typeOptions,
  columnOptions,
  onApplyFilters,
  onColumnVisibleChange,
  onResetLayout,
  onClose,
}: CardListOptionsModalProps) => {
  const [tab, setTab] = useState<OptionsTab>(initialTab)
  const [draftFilters, setDraftFilters] = useState(filters)

  useEffect(() => {
    if (open) {
      setTab(initialTab)
      setDraftFilters(filters)
    }
  }, [open, initialTab, filters])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const tabBtnClass = (active: boolean) =>
    [
      'flex-1 text-[12px] py-1.5 rounded border',
      active ? 'font-medium' : '',
    ].join(' ')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="rounded-md p-5 min-w-[300px] max-w-[380px] w-full"
        style={{
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
      >
        <p
          className="text-[13px] font-medium mb-3"
          style={{ color: 'var(--color-text)' }}
        >
          목록 옵션
        </p>

        <div className="flex gap-1.5 mb-3">
          <button
            type="button"
            className={tabBtnClass(tab === 'filter')}
            style={{
              background: tab === 'filter' ? 'var(--color-btn-hover)' : 'transparent',
              borderColor: 'var(--color-border)',
              color:
                tab === 'filter' ? 'var(--color-text)' : 'var(--color-text-muted)',
            }}
            onClick={() => setTab('filter')}
          >
            데이터 필터
          </button>
          <button
            type="button"
            className={tabBtnClass(tab === 'columns')}
            style={{
              background: tab === 'columns' ? 'var(--color-btn-hover)' : 'transparent',
              borderColor: 'var(--color-border)',
              color:
                tab === 'columns' ? 'var(--color-text)' : 'var(--color-text-muted)',
            }}
            onClick={() => setTab('columns')}
          >
            컬럼
          </button>
        </div>

        {tab === 'filter' ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                상태
              </span>
              <Select
                value={draftFilters.status}
                onChange={(v) =>
                  setDraftFilters((d) => ({
                    ...d,
                    status: v as CardListFilters['status'],
                  }))
                }
                options={[
                  { value: 'all', label: '전체' },
                  { value: '활성', label: '활성' },
                  { value: '비활성', label: '비활성' },
                ]}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                유형
              </span>
              <Select
                value={draftFilters.type}
                onChange={(v) => setDraftFilters((d) => ({ ...d, type: v }))}
                options={[
                  { value: 'all', label: '전체' },
                  ...typeOptions.map((t) => ({ value: t, label: t })),
                ]}
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                카드 사용자
              </span>
              <Select
                value={draftFilters.assignment}
                onChange={(v) =>
                  setDraftFilters((d) => ({
                    ...d,
                    assignment: v as CardListFilters['assignment'],
                  }))
                }
                options={[
                  { value: 'all', label: '전체' },
                  { value: 'assigned', label: '할당됨' },
                  { value: 'unassigned', label: '미할당' },
                ]}
              />
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
              표시할 컬럼을 선택하세요. 헤더를 끌어 다른 컬럼 위에 놓으면 순서가 바뀌고,
              헤더를 클릭하면 정렬됩니다. 오른쪽 경계를 드래그하면 너비를 조절할 수
              있습니다.
            </p>
            <ul
              className="flex flex-col gap-1 max-h-[240px] overflow-y-auto app-scrollbar"
              style={{ border: '0.5px solid var(--color-border)', borderRadius: 4 }}
            >
              {columnOptions.map((col) => (
                <li
                  key={col.key}
                  className="flex items-center gap-2 px-2 py-1.5"
                  style={{ borderBottom: '0.5px solid var(--color-border-subtle)' }}
                >
                  <Checkbox
                    checked={col.visible}
                    disabled={!col.hideable}
                    onChange={(v) => onColumnVisibleChange(col.key, v)}
                  />
                  <span className="text-[12px]" style={{ color: 'var(--color-text)' }}>
                    {col.header}
                    {!col.hideable && (
                      <span
                        className="ml-1 text-[10px]"
                        style={{ color: 'var(--color-text-muted)' }}
                      >
                        (필수)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-5 flex-wrap">
          {tab === 'filter' ? (
            <>
              <Button
                variant="default"
                size="md"
                onClick={() => {
                  setDraftFilters(defaultCardListFilters)
                  onApplyFilters(defaultCardListFilters)
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
                  onApplyFilters(draftFilters)
                  onClose()
                }}
              >
                적용
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="default"
                size="md"
                onClick={() => {
                  onResetLayout()
                  onClose()
                }}
              >
                컬럼 초기화
              </Button>
              <Button variant="accent" size="md" onClick={onClose}>
                닫기
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
