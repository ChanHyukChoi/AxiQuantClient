import { deviceEventToRecord, nextEventId } from '@/lib/eventMonitor/eventRecords'
import type { EventRecord } from '@/types/api/eventMonitor'
import type { DeviceEventMessage } from '@/types/api/sse'

const MOCK_TEMPLATES: readonly DeviceEventMessage[] = [
  {
    sourceModule: 'Access',
    deviceId: 'READER-01',
    eventType: 'Card Accepted',
    payloadJson: JSON.stringify({
      event: 'Card Accepted',
      card: '1234567890',
      user: '홍길동',
      ctrl: 'SCP-01',
      device: 'MAIN GATE',
      direction: 'IN',
    }),
    occurredAtUtcTicks: 0,
  },
  {
    sourceModule: 'Access',
    deviceId: 'READER-02',
    eventType: 'Card Rejected',
    payloadJson: JSON.stringify({
      event: 'Card Rejected',
      card: '9876543210',
      user: '—',
      ctrl: 'SCP-01',
      device: 'SIDE GATE',
      direction: 'OUT',
    }),
    occurredAtUtcTicks: 0,
  },
  {
    sourceModule: 'Alarm',
    deviceId: 'INPUT-03',
    eventType: 'Door Forced Open',
    payloadJson: JSON.stringify({
      event: 'Door Forced Open',
      ctrl: 'SCP-01',
      device: 'MAIN GATE READER',
      acked: false,
    }),
    occurredAtUtcTicks: 0,
  },
  {
    sourceModule: 'Adam',
    deviceId: 'ADAM-01-INPUT-1',
    eventType: 'ADAM Input Active',
    payloadJson: JSON.stringify({
      event: 'ADAM Input Active',
      ctrl: 'ADAM-01',
      device: 'INPUT 1',
    }),
    occurredAtUtcTicks: 0,
  },
  {
    sourceModule: 'Alarm',
    deviceId: 'ZONE-01',
    eventType: 'Intrusion Detected',
    payloadJson: JSON.stringify({
      event: 'Intrusion Detected',
      ctrl: 'DGU-01',
      device: 'ZONE A',
      acked: false,
    }),
    occurredAtUtcTicks: 0,
  },
] as const

let templateCursor = 0

export const nextMockDeviceEvent = (): DeviceEventMessage => {
  const template = MOCK_TEMPLATES[templateCursor % MOCK_TEMPLATES.length]
  templateCursor += 1
  return { ...template }
}

export const createSeedLiveEvents = (count: number): EventRecord[] => {
  const rows: EventRecord[] = []
  for (let i = 0; i < count; i += 1) {
    rows.push(deviceEventToRecord(nextMockDeviceEvent(), nextEventId()))
  }
  return rows.reverse()
}

/** 회의용 — SSE 없이도 실시간 그리드 데모 */
export const MOCK_LIVE_INTERVAL_MS = 5000
export const MOCK_LIVE_SEED_COUNT = 3
