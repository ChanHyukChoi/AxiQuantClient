import { useCallback, useEffect, useRef, useState } from 'react'
import { deviceEventToRecord, nextEventId, resetLiveEventSeq } from '@/lib/eventMonitorMappers'
import { sseClient } from '@/lib/sse'
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
  const [events, setEvents] = useState<EventRecord[]>([])
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
