import { Activity } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { Drawer } from '@/components/primitive/Drawer'
import { EVENT_MONITOR_FONT_SIZE } from '@/pages/EventMonitorPage/eventMonitorUi'
import type { EventRecord } from '@/types/api/eventMonitor'

interface EventDetailPanelProps {
  event: EventRecord | null
  onAck: (id: number) => void
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5 py-1.5">
    <span className="app-text-sm" style={{ color: 'var(--color-text-dim)' }}>
      {label}
    </span>
    <span className="app-text-md break-words" style={{ color: 'var(--color-text)' }}>
      {value || '—'}
    </span>
  </div>
)

export const EventDetailPanel = ({ event, onAck }: EventDetailPanelProps) => {
  const drawerHeader = event ? (
    <div>
      <p className="app-text-md font-medium mb-0.5" style={{ color: 'var(--color-text)' }}>
        {event.event}
      </p>
      <p className="app-text-md font-mono" style={{ color: 'var(--color-text-subtle)' }}>
        {event.ts}
      </p>
    </div>
  ) : (
    <div className="flex items-center gap-2 py-2">
      <Activity size={18} style={{ color: 'var(--color-text-dim)' }} />
      <p className="app-text-md" style={{ color: 'var(--color-text-dim)' }}>
        이벤트를 선택하세요
      </p>
    </div>
  )

  const footer =
    event?.type === 'alarm' ? (
      event.acked ? (
        <div
          className="text-center app-text-md font-medium py-2 rounded"
          style={{ background: '#0d2b1a', color: '#4caf7d' }}
        >
          확인 완료
        </div>
      ) : (
        <Button
          variant="danger"
          className="w-full"
          fontSize={EVENT_MONITOR_FONT_SIZE}
          onClick={() => onAck(event.id)}
          style={{ background: '#2b1616', color: '#e06060', borderColor: '#3a2020' }}
        >
          경보 확인 (ACK)
        </Button>
      )
    ) : undefined

  const typeLabel = event?.type === 'alarm' ? '경보' : '출입'

  return (
    <Drawer fill borderLeft={false} header={drawerHeader} footer={footer}>
      {event ? (
        <div className="px-1">
          <DetailRow label="종류" value={typeLabel} />
          <DetailRow label="카드번호" value={event.card} />
          <DetailRow label="카드 사용자" value={event.user} />
          <DetailRow label="제어기" value={event.ctrl} />
          <DetailRow label="장치" value={event.device} />
          <DetailRow label="방향" value={event.direction} />
        </div>
      ) : (
        <div className="flex-1 min-h-[120px]" aria-hidden />
      )}
    </Drawer>
  )
}
