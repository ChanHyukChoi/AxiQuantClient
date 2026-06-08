import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { wireToModuleInfo } from '@/lib/mappers/moduleMappers'
import { sseClient } from '@/lib/infra/sse'
import { queryKeys } from '@/lib/query/queryKeys'
import type { ModuleInfo, SseEventName } from '@/types/api'

const invalidateDeviceControl = (qc: ReturnType<typeof useQueryClient>, key: readonly unknown[]) => {
  void qc.invalidateQueries({ queryKey: key })
  void qc.invalidateQueries({ queryKey: ['devices', ...key.slice(1)] })
}

const deviceControlEventMap: Partial<Record<string, readonly unknown[]>> = {
  OnScpChanged: queryKeys.deviceControl.scps(),
  OnSioChanged: ['deviceControl', 'sios'],
  OnInputChanged: ['deviceControl', 'inputs'],
  OnOutputChanged: ['deviceControl', 'outputs'],
  OnReaderChanged: ['deviceControl', 'readers'],
}

const parseModulePayload = (data: string): ModuleInfo | null => {
  try {
    const parsed: unknown = JSON.parse(data)
    if (parsed == null || typeof parsed !== 'object') return null
    return wireToModuleInfo(parsed as Record<string, unknown>)
  } catch {
    return null
  }
}

export const useDeviceControlSse = () => {
  const qc = useQueryClient()

  useEffect(() => {
    const handlers: Array<{ event: SseEventName; handler: (data?: string) => void }> = []

    for (const [event, queryKey] of Object.entries(deviceControlEventMap)) {
      const handler = () => invalidateDeviceControl(qc, queryKey as readonly unknown[])
      sseClient.on(event as SseEventName, handler)
      handlers.push({ event: event as SseEventName, handler })
    }

    const moduleHandler = (data?: string) => {
      if (!data) {
        void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.modules() })
        return
      }
      const module = parseModulePayload(data)
      if (!module) {
        void qc.invalidateQueries({ queryKey: queryKeys.deviceControl.modules() })
        return
      }
      qc.setQueryData<ModuleInfo[] | null>(queryKeys.deviceControl.modules(), (prev) => {
        const list = prev ?? []
        const idx = list.findIndex((m) => m.moduleType === module.moduleType)
        if (idx >= 0) {
          const next = [...list]
          next[idx] = { ...next[idx], ...module }
          return next
        }
        return [...list, module]
      })
    }

    sseClient.on('OnModuleStatusChanged', moduleHandler)
    handlers.push({ event: 'OnModuleStatusChanged', handler: moduleHandler })

    return () => {
      handlers.forEach(({ event, handler }) => sseClient.off(event, handler))
    }
  }, [qc])
}
