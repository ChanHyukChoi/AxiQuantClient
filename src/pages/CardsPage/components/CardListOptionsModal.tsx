import { useEffect, useState } from 'react'
import {
  LIST_OPTIONS_FONT_SIZE,
  ListOptionsFilterField,
  ListOptionsModalShell,
} from '@/components/basic/ListOptionsModalShell'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Select } from '@/components/primitive/Select'
import type { GridColumnOption } from '@/hooks/ui/useGridLayout'
import { CARD_STATUS_VALUES, type CardStatusValue } from '@/pages/CardsPage/formTypes'

export type CardListFilters = {
  status: 'all' | CardStatusValue
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

  if (!open) return null

  return (
    <ListOptionsModalShell
      open={open}
      tabs={[
        { id: 'filter', label: '데이터 필터' },
        { id: 'columns', label: '컬럼' },
      ]}
      activeTab={tab}
      onTabChange={(id) => setTab(id as OptionsTab)}
      onClose={onClose}
      footer={
        tab === 'filter' ? (
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
        )
      }
    >
      {tab === 'filter' ? (
        <div className="flex flex-col gap-3">
          <ListOptionsFilterField label="상태">
            <Select
              value={draftFilters.status}
              fontSize={LIST_OPTIONS_FONT_SIZE}
                  onChange={(v) =>
                    setDraftFilters((d) => ({
                      ...d,
                      status: v as CardListFilters['status'],
                    }))
                  }
              options={[
                { value: 'all', label: '전체' },
                ...CARD_STATUS_VALUES.map((value) => ({ value, label: value })),
              ]}
            />
          </ListOptionsFilterField>

          <ListOptionsFilterField label="유형">
            <Select
              value={draftFilters.type}
              fontSize={LIST_OPTIONS_FONT_SIZE}
              onChange={(v) => setDraftFilters((d) => ({ ...d, type: v }))}
              options={[
                { value: 'all', label: '전체' },
                ...typeOptions.map((t) => ({ value: t, label: t })),
              ]}
            />
          </ListOptionsFilterField>

          <ListOptionsFilterField label="카드 사용자">
            <Select
              value={draftFilters.assignment}
              fontSize={LIST_OPTIONS_FONT_SIZE}
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
          </ListOptionsFilterField>
        </div>
      ) : (
        <div className="flex flex-col gap-2 h-full min-h-0">
          <p
            className="leading-snug shrink-0"
            style={{ color: 'var(--color-text-muted)', fontSize: LIST_OPTIONS_FONT_SIZE }}
          >
            표시할 컬럼을 선택하세요. 헤더를 끌어 다른 컬럼 위에 놓으면 순서가 바뀌고, 헤더를
            클릭하면 정렬됩니다. 오른쪽 경계를 드래그하면 너비를 조절할 수 있습니다.
          </p>
          <ul
            className="flex flex-col gap-1 flex-1 min-h-0 overflow-y-auto app-scrollbar"
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
                <span style={{ color: 'var(--color-text)', fontSize: LIST_OPTIONS_FONT_SIZE }}>
                  {col.header}
                  {!col.hideable && (
                    <span
                      className="ml-1"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontSize: LIST_OPTIONS_FONT_SIZE,
                      }}
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
    </ListOptionsModalShell>
  )
}
