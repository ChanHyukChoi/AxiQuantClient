import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FilterButton } from '@/components/page-actions'
import {
  EventFilterModal,
  isEventFiltersActive,
  type EventListFilters,
} from '@/pages/EventMonitorPage/components/EventFilterModal'

export type EventFilterScope = 'live' | 'history'

interface EventFilterButtonProps {
  scope: EventFilterScope
  filters: EventListFilters
  onApplyFilters: (filters: EventListFilters) => void
}

export const EventFilterButton = ({ scope, filters, onApplyFilters }: EventFilterButtonProps) => {
  const { t } = useTranslation('eventMonitor')
  const [open, setOpen] = useState(false)

  return (
    <>
      <FilterButton
        showLabel={false}
        title={t('filter')}
        active={isEventFiltersActive(filters)}
        onClick={() => setOpen(true)}
      />
      <EventFilterModal
        open={open}
        scope={scope}
        filters={filters}
        onApply={onApplyFilters}
        onClose={() => setOpen(false)}
      />
    </>
  )
}
