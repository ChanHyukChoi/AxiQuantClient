import i18n from '@/lib/i18n'
import type { EventRecord } from '@/types/api/eventMonitor'

export type TypeFilter = 'all' | 'access' | 'alarm'

export const filterByType = (rows: EventRecord[], typeFilter: TypeFilter): EventRecord[] => {
  if (typeFilter === 'all') return rows
  return rows.filter((r) => r.type === typeFilter)
}

export const filterBySearch = (rows: EventRecord[], q: string): EventRecord[] => {
  const needle = q.trim().toLowerCase()
  if (!needle) return rows
  return rows.filter((r) =>
    [r.event, r.card, r.user, r.device, r.ctrl].join(' ').toLowerCase().includes(needle),
  )
}

export const filterByUnacked = (rows: EventRecord[], unackedOnly: boolean): EventRecord[] => {
  if (!unackedOnly) return rows
  return rows.filter((r) => r.type === 'alarm' && !r.acked)
}

export const exportEventsCsv = (events: EventRecord[], filenamePrefix = 'event-history'): void => {
  const t = i18n.getFixedT(null, 'eventMonitor')
  const header = [
    t('field.ts'),
    t('field.type'),
    t('field.event'),
    t('field.cardDetail'),
    t('field.user'),
    t('field.controller'),
    t('field.device'),
    t('field.ack'),
  ]
  const lines = events.map((r) =>
    [
      r.ts,
      r.type === 'alarm' ? t('type.alarm') : t('type.access'),
      r.event,
      r.card,
      r.user,
      r.ctrl,
      r.device,
      r.type === 'alarm' ? (r.acked ? t('ack.confirmed') : t('ack.unconfirmed')) : '',
    ].join(','),
  )
  const csv = [header.join(','), ...lines].join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filenamePrefix}-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
