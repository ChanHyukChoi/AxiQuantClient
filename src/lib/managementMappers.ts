import type { StartTestEventsRequest, TestEventStatus } from '@/types/api/management'

export const wireToTestEventStatus = (row: Record<string, unknown>): TestEventStatus => {
  const emitting = Boolean(row.emitting ?? row.isRunning)
  const minMs = typeof row.minIntervalMs === 'number' ? row.minIntervalMs : undefined
  const maxMs = typeof row.maxIntervalMs === 'number' ? row.maxIntervalMs : undefined
  const intervalMs =
    typeof row.intervalMs === 'number'
      ? row.intervalMs
      : minMs ?? maxMs

  return {
    isRunning: emitting,
    startedAt:
      typeof row.startedAt === 'string'
        ? row.startedAt
        : typeof row.startedAtUtc === 'string'
          ? row.startedAtUtc
          : undefined,
    eventCount: typeof row.eventCount === 'number' ? row.eventCount : undefined,
    intervalMs,
  }
}

export const startTestEventsToWire = (options?: StartTestEventsRequest): Record<string, unknown> => {
  const intervalMs = options?.intervalMs ?? 1000
  const eventCount = options?.eventCount
  return {
    intervalMs,
    eventCount,
    minIntervalMs: intervalMs,
    maxIntervalMs: intervalMs,
  }
}

export const parseTestEventStatus = (data: unknown): TestEventStatus | null => {
  if (data == null || typeof data !== 'object' || Array.isArray(data)) return null
  return wireToTestEventStatus(data as Record<string, unknown>)
}
