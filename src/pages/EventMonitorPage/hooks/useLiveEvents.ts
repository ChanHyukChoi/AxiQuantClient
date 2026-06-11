import { useCallback, useEffect, useRef, useState } from 'react'
import { deviceEventToRecord, nextEventId, resetLiveEventSeq } from '@/lib/eventMonitor/eventRecords'
import { sseClient } from '@/lib/infra/sse'
import {
  createSeedLiveEvents,
  MOCK_LIVE_INTERVAL_MS,
  MOCK_LIVE_SEED_COUNT,
  nextMockDeviceEvent,
} from '@/pages/EventMonitorPage/mockLiveEvents'
import type { EventRecord } from '@/types/api/eventMonitor'
import type { DeviceEventMessage } from '@/types/api/sse'

const MAX_LIVE = 200

const parseDeviceEvent = (raw: string): DeviceEventMessage | null => {
  try {
    const v = JSON.parse(raw) as unknown
    if (typeof v !== 'object' || v === null) return null
    const o = v as Record<string, unknown>
    return {
      sourceModule: String(o.sourceModule ?? ''),
      deviceId: String(o.deviceId ?? ''),
      eventType: String(o.eventType ?? ''),
      payloadJson: String(o.payloadJson ?? '{}'),
      occurredAtUtcTicks: Number(o.occurredAtUtcTicks ?? 0),
    }
  } catch {
    return null
  }
}

export const useLiveEvents = () => {
  const [events, setEvents] = useState<EventRecord[]>(() => {
    resetLiveEventSeq()
    return createSeedLiveEvents(MOCK_LIVE_SEED_COUNT)
  })
  const [paused, setPaused] = useState(false)
  const pausedRef = useRef(paused)

  useEffect(() => {
    pausedRef.current = paused
  }, [paused])

  const appendEvent = useCallback((msg: DeviceEventMessage) => {
    const record = deviceEventToRecord(msg, nextEventId())
    setEvents((prev) => {
      const next = [record, ...prev]
      return next.length > MAX_LIVE ? next.slice(0, MAX_LIVE) : next
    })
  }, [])

  useEffect(() => {
    const handler = (data: string) => {
      const msg = parseDeviceEvent(data)
      if (!msg) return
      if (pausedRef.current) return
      appendEvent(msg)
    }

    sseClient.on('OnEventReceived', handler)
    return () => sseClient.off('OnEventReceived', handler)
  }, [appendEvent])

  useEffect(() => {
    const timer = window.setInterval(() => {
      if (pausedRef.current) return
      appendEvent(nextMockDeviceEvent())
    }, MOCK_LIVE_INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [appendEvent])

  const clear = useCallback(() => {
    resetLiveEventSeq()
    setEvents([])
  }, [])

  const ack = useCallback((id: number) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, acked: true } : e)))
  }, [])

  return {
    events,
    paused,
    setPaused,
    clear,
    ack,
    isConnected: sseClient.isConnected,
  }
}
