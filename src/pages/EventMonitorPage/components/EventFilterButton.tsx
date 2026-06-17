import { useTranslation } from 'react-i18next'
import { FilterButton } from '@/components/page-actions'

export type EventFilterScope = 'live' | 'history'

export const EventFilterButton = ({ scope }: { scope: EventFilterScope }) => {
  const { t } = useTranslation('eventMonitor')

  return (
    <FilterButton
      showLabel={false}
      title={t('filter')}
      onClick={() => {
        if (scope === 'live') {
          /* TODO: LiveEventFilterModal */
        } else {
          /* TODO: HistoryEventFilterModal */
        }
      }}
    />
  )
}
