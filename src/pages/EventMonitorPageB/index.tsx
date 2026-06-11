import { EventMonitorShell } from '@/pages/EventMonitorPage/EventMonitorShell'
import { HistoryTabB } from '@/pages/EventMonitorPage/tabs/HistoryTabB'
import { LiveTabB } from '@/pages/EventMonitorPage/tabs/LiveTabB'

/**
 * 이벤트 모니터 2안 — 실시간 / 이력 조회 Tab 분리 (B1)
 */
export const EventMonitorPageB = () => (
  <EventMonitorShell
    liveTab={<LiveTabB />}
    historyTab={<HistoryTabB />}
    variantPaths={{ a: '/monitor', b: '/monitor-b' }}
  />
)
