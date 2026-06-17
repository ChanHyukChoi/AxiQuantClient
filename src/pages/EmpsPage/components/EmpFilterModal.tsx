import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation(['emp', 'common'])
  const [draft, setDraft] = useState(filters)

  const filterTab = useMemo(
    () => ({ id: 'filter', label: t('emp:filter.tab') }) as const,
    [t],
  )

  useEffect(() => {
    if (open) setDraft(filters)
  }, [open, filters])

  return (
    <ListOptionsModalShell
      open={open}
      tabs={[filterTab]}
      activeTab={filterTab.id}
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
            {t('common:reset')}
          </Button>
          <Button variant="default" size="md" onClick={onClose}>
            {t('common:cancel')}
          </Button>
          <Button
            variant="accent"
            size="md"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
          >
            {t('common:apply')}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <ListOptionsFilterField label={t('emp:filter.cardAssignment')}>
          <Select
            value={draft.cardAssignment}
            fontSize={LIST_OPTIONS_FONT_SIZE}
            onChange={(v) =>
              setDraft({
                cardAssignment: v as EmpListFilters['cardAssignment'],
              })
            }
            options={[
              { value: 'all', label: t('emp:filter.all') },
              { value: 'has', label: t('emp:filter.hasCard') },
              { value: 'none', label: t('emp:filter.noCard') },
            ]}
          />
        </ListOptionsFilterField>
      </div>
    </ListOptionsModalShell>
  )
}
