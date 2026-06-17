import { useTranslation } from 'react-i18next'
import { Button } from '@/components/primitive/Button'
import { Drawer } from '@/components/primitive/Drawer'
import { DrawerSelectPrompt } from '@/components/basic/DrawerSelectPrompt'
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
  const { t } = useTranslation(['eventMonitor', 'common'])

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
    <div />
  )

  const footer =
    event?.type === 'alarm' ? (
      event.acked ? (
        <div
          className="text-center app-text-md font-medium py-2 rounded"
          style={{ background: '#0d2b1a', color: '#4caf7d' }}
        >
          {t('eventMonitor:ack.done')}
        </div>
      ) : (
        <Button
          variant="danger"
          className="w-full"
          fontSize={EVENT_MONITOR_FONT_SIZE}
          onClick={() => onAck(event.id)}
          style={{ background: '#2b1616', color: '#e06060', borderColor: '#3a2020' }}
        >
          {t('eventMonitor:ack.button')}
        </Button>
      )
    ) : undefined

  const typeLabel =
    event?.type === 'alarm' ? t('eventMonitor:type.alarm') : t('eventMonitor:type.access')

  return (
    <Drawer fill borderLeft={false} contentFill={!event} header={drawerHeader} footer={footer}>
      {event ? (
        <div className="px-1">
          <DetailRow label={t('eventMonitor:field.type')} value={typeLabel} />
          <DetailRow label={t('eventMonitor:field.cardDetail')} value={event.card} />
          <DetailRow label={t('eventMonitor:field.user')} value={event.user} />
          <DetailRow label={t('eventMonitor:field.controller')} value={event.ctrl} />
          <DetailRow label={t('eventMonitor:field.device')} value={event.device} />
          <DetailRow label={t('eventMonitor:field.direction')} value={event.direction} />
        </div>
      ) : (
        <DrawerSelectPrompt message={t('eventMonitor:selectEvent')} />
      )}
    </Drawer>
  )
}
