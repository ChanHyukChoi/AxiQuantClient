import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { sseClient } from '@/lib/infra/sse'
import { queryKeys } from '@/lib/query/queryKeys'
import type { SseEventName } from '@/types/api'

const eventKeyMap: Partial<Record<string, readonly unknown[]>> = {
  OnScpChanged: queryKeys.deviceControl.scps(),
  OnCardChanged: queryKeys.card.all,
  OnCardFmtChanged: queryKeys.cardFmts.all(),
  OnAreaChanged: queryKeys.areas.all(),
  OnHolidayChanged: queryKeys.holiday.all,
  OnTimezoneChanged: queryKeys.timezone.all,
  OnAccLvChanged: queryKeys.acclv.all,
  OnModuleStatusChanged: queryKeys.deviceControl.modules(),
  OnSioChanged: ['deviceControl', 'sios'],
  OnInputChanged: ['deviceControl', 'inputs'],
  OnOutputChanged: ['deviceControl', 'outputs'],
  OnReaderChanged: ['deviceControl', 'readers'],
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
