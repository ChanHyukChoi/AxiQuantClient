import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { sseClient } from '@/lib/sse'
import { queryKeys } from '@/lib/queryKeys'
import type { SseEventName } from '@/types/api'

const eventKeyMap: Partial<Record<string, readonly unknown[]>> = {
  OnScpChanged: queryKeys.scp.all,
  OnCardChanged: queryKeys.card.all,
  OnCardFmtChanged: queryKeys.cardfmt.all,
  OnAreaChanged: queryKeys.area.all,
  OnHolidayChanged: queryKeys.holiday.all,
  OnTimezoneChanged: queryKeys.timezone.all,
  OnAccLvChanged: queryKeys.acclv.all,
  OnModuleStatusChanged: queryKeys.modules.all,
  OnSioChanged: ['sio'],
  OnInputChanged: ['input'],
  OnOutputChanged: ['output'],
  OnReaderChanged: ['reader'],
  OnAccLvRdrChanged: ['acclv'],
  OnCardAccLvChanged: ['card'],
}

export const useSseInvalidate = () => {
  const qc = useQueryClient()

  useEffect(() => {
    const handlers: Array<{ event: SseEventName; handler: () => void }> = []

    for (const [event, queryKey] of Object.entries(eventKeyMap)) {
      const handler = () => {
        void qc.invalidateQueries({ queryKey: queryKey as readonly unknown[] })
      }
      sseClient.on(event as SseEventName, handler)
      handlers.push({ event: event as SseEventName, handler })
    }

    return () => {
      handlers.forEach(({ event, handler }) => sseClient.off(event, handler))
    }
  }, [qc])
}
