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

export const exportEventsCsv = (events: EventRecord[], filenamePrefix = 'event-history'): void => {
  const header = ['일시', '종류', '이벤트', '카드번호', '사용자', '제어기', '장치', 'ACK']
  const lines = events.map((r) =>
    [
      r.ts,
      r.type === 'alarm' ? '경보' : '출입',
      r.event,
      r.card,
      r.user,
      r.ctrl,
      r.device,
      r.type === 'alarm' ? (r.acked ? '확인' : '미확인') : '',
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
