export interface DeviceEventMessage {
  sourceModule: string
  deviceId: string
  eventType: string
  payloadJson: string
  occurredAtUtcTicks: number
}

export type SseEventName =
  | 'device-event'
  | 'access-event'
  | 'alarm-event'
  | 'connection-status'
  | 'heartbeat'
  | (string & Record<never, never>)
