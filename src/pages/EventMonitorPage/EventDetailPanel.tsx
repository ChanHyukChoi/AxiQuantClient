import { Button } from '@/components/primitive/Button'
import type { EventRecord } from '@/types/api/eventMonitor'

interface EventDetailPanelProps {
  event: EventRecord | null
  onAck: (id: number) => void
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-0.5 py-1.5">
    <span className="text-[10px]" style={{ color: 'var(--color-text-dim)' }}>
      {label}
    </span>
    <span className="text-[12px] break-words" style={{ color: 'var(--color-text)' }}>
      {value || '—'}
    </span>
  </div>
)

export const EventDetailPanel = ({ event, onAck }: EventDetailPanelProps) => {
  if (!event) {
    return (
      <aside
        className="flex flex-col flex-shrink-0 h-full items-center justify-center px-3"
        style={{
          width: 240,
          borderLeft: '0.5px solid var(--color-border)',
          background: 'var(--color-sidebar)',
        }}
      >
        <p className="text-[12px] text-center" style={{ color: 'var(--color-text-dim)' }}>
          이벤트를 선택하세요
        </p>
      </aside>
    )
  }

  const typeLabel = event.type === 'alarm' ? '경보' : '출입'

  return (
    <aside
      className="flex flex-col flex-shrink-0 h-full overflow-hidden"
      style={{
        width: 240,
        borderLeft: '0.5px solid var(--color-border)',
        background: 'var(--color-sidebar)',
      }}
    >
      <div className="px-3 pt-3 pb-2 flex-shrink-0">
        <p
          className="text-[13px] font-medium mb-0.5"
          style={{ color: 'var(--color-text)' }}
        >
          {event.event}
        </p>
        <p
          className="text-[11px] font-mono"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          {event.ts}
        </p>
      </div>

      <div className="px-3 flex-1 overflow-auto">
        <DetailRow label="종류" value={typeLabel} />
        <DetailRow label="카드번호" value={event.card} />
        <DetailRow label="카드 사용자" value={event.user} />
        <DetailRow label="제어기" value={event.ctrl} />
        <DetailRow label="장치" value={event.device} />
        <DetailRow label="방향" value={event.direction} />
      </div>

      {event.type === 'alarm' && (
        <div
          className="p-3 flex-shrink-0"
          style={{ borderTop: '0.5px solid var(--color-border)' }}
        >
          {event.acked ? (
            <div
              className="text-center text-[12px] font-medium py-2 rounded"
              style={{ background: '#0d2b1a', color: '#4caf7d' }}
            >
              확인 완료
            </div>
          ) : (
            <Button
              variant="danger"
              className="w-full"
              onClick={() => onAck(event.id)}
              style={{ background: '#2b1616', color: '#e06060', borderColor: '#3a2020' }}
            >
              경보 확인 (ACK)
            </Button>
          )}
        </div>
      )}
    </aside>
  )
}
