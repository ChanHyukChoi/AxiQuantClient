import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import {
  cardStatusDisplay,
  cardTypeDisplay,
} from '@/pages/CardsPage/utils/cardPageHelpers'

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
  const { t } = useTranslation(['card', 'common'])
  const [tab, setTab] = useState<OptionsTab>(initialTab)
  const [draftFilters, setDraftFilters] = useState(filters)

  const tabs = useMemo(
    () => [
      { id: 'filter' as const, label: t('card:filter.dataFilter') },
      { id: 'columns' as const, label: t('card:filter.columns') },
    ],
    [t],
  )

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
      tabs={tabs}
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
              {t('common:reset')}
            </Button>
            <Button variant="default" size="md" onClick={onClose}>
              {t('common:cancel')}
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={() => {
                onApplyFilters(draftFilters)
                onClose()
              }}
            >
              {t('common:apply')}
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
              {t('card:filter.resetColumns')}
            </Button>
            <Button variant="accent" size="md" onClick={onClose}>
              {t('common:close')}
            </Button>
          </>
        )
      }
    >
      {tab === 'filter' ? (
        <div className="flex flex-col gap-3">
          <ListOptionsFilterField label={t('card:filter.status')}>
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
                { value: 'all', label: t('card:filter.all') },
                ...CARD_STATUS_VALUES.map((value) => ({
                  value,
                  label: cardStatusDisplay(value, t),
                })),
              ]}
            />
          </ListOptionsFilterField>

          <ListOptionsFilterField label={t('card:filter.type')}>
            <Select
              value={draftFilters.type}
              fontSize={LIST_OPTIONS_FONT_SIZE}
              onChange={(v) => setDraftFilters((d) => ({ ...d, type: v }))}
              options={[
                { value: 'all', label: t('card:filter.all') },
                ...typeOptions.map((typeValue) => ({
                  value: typeValue,
                  label: cardTypeDisplay(typeValue, t),
                })),
              ]}
            />
          </ListOptionsFilterField>

          <ListOptionsFilterField label={t('card:filter.assignment')}>
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
                { value: 'all', label: t('card:filter.all') },
                { value: 'assigned', label: t('card:filter.assigned') },
                { value: 'unassigned', label: t('card:filter.unassigned') },
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
            {t('card:filter.columnHelp')}
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
                      {t('card:filter.required')}
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
