export interface LogLevelInfo {
  target?: string
  level: string
}

export interface SetLogLevelRequest {
  target: string
  level: string
}

export interface TestEventStatus {
  isRunning: boolean
  startedAt?: string
  eventCount?: number
  intervalMs?: number
}

export interface StartTestEventsRequest {
  intervalMs?: number
  eventCount?: number
}
