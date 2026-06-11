import { FilterButton } from '@/components/page-actions'

export type EventFilterScope = 'live' | 'history'

/** 이벤트 필터 — 패널/모달은 추후 연결 */
export const EventFilterButton = ({ scope }: { scope: EventFilterScope }) => (
  <FilterButton
    showLabel={false}
    title="필터"
    onClick={() => {
      if (scope === 'live') {
        /* TODO: LiveEventFilterModal */
      } else {
        /* TODO: HistoryEventFilterModal */
      }
    }}
  />
)
