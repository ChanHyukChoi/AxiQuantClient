// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string
  expiresAt: string
}

// ─── SCP (Security Control Panel) ────────────────────────────────────────────

export interface ScpInfo {
  id: number
  name: string
  ipAddress: string
  port: number
  description?: string
  isOnline?: boolean
}

export type CreateScpRequest = Omit<ScpInfo, 'id' | 'isOnline'>
export type UpdateScpRequest = Omit<ScpInfo, 'id' | 'isOnline'>

// ─── SIO (Secure I/O Module) ──────────────────────────────────────────────────

export interface SioInfo {
  id: number
  scpId: number
  name: string
  index: number
  description?: string
}

export type CreateSioRequest = Omit<SioInfo, 'id' | 'scpId'>
export type UpdateSioRequest = Omit<SioInfo, 'id' | 'scpId'>

// ─── Input ────────────────────────────────────────────────────────────────────

export interface InputInfo {
  id: number
  scpId: number
  name: string
  index: number
  sioId?: number
  description?: string
}

export type CreateInputRequest = Omit<InputInfo, 'id' | 'scpId'>
export type UpdateInputRequest = Omit<InputInfo, 'id' | 'scpId'>

// ─── Output ───────────────────────────────────────────────────────────────────

export interface OutputInfo {
  id: number
  scpId: number
  name: string
  index: number
  sioId?: number
  description?: string
}

export type CreateOutputRequest = Omit<OutputInfo, 'id' | 'scpId'>
export type UpdateOutputRequest = Omit<OutputInfo, 'id' | 'scpId'>

// ─── Reader ───────────────────────────────────────────────────────────────────

export interface ReaderInfo {
  id: number
  scpId: number
  name: string
  index: number
  cardFmtId?: number
  description?: string
}

export type CreateReaderRequest = Omit<ReaderInfo, 'id' | 'scpId'>
export type UpdateReaderRequest = Omit<ReaderInfo, 'id' | 'scpId'>

// ─── Employee ─────────────────────────────────────────────────────────────────

export interface EmpInfo {
  id: number
  name: string
  employeeNumber: string
  department?: string
  email?: string
  phone?: string
}

export type CreateEmpRequest = Omit<EmpInfo, 'id'>
export type UpdateEmpRequest = Omit<EmpInfo, 'id'>

// ─── Card ─────────────────────────────────────────────────────────────────────

export interface CardInfo {
  cid: number
  cardNumber: string
  empId?: number
  empName?: string
  isActive: boolean
  issuedAt?: string
  expiredAt?: string
}

export type CreateCardRequest = Omit<CardInfo, 'cid' | 'empName'>
export type UpdateCardRequest = Omit<CardInfo, 'cid' | 'empName'>

export interface CardAccLvInfo {
  id: number
  cardId: number
  accLvId: number
  accLvName?: string
}

export interface AddCardAccLvRequest {
  accLvId: number
}

// ─── Access Level ─────────────────────────────────────────────────────────────

export interface AccLvInfo {
  id: number
  name: string
  description?: string
}

export type CreateAccLvRequest = Omit<AccLvInfo, 'id'>
export type UpdateAccLvRequest = Omit<AccLvInfo, 'id'>

export interface AccLvRdrInfo {
  accLvId: number
  scpId: number
  readerId: number
  readerName?: string
  scpName?: string
}

export interface AddAccLvReaderRequest {
  scpId: number
  readerId: number
}

// ─── Area ─────────────────────────────────────────────────────────────────────

export interface AreaInfo {
  id: number
  name: string
  description?: string
}

export type CreateAreaRequest = Omit<AreaInfo, 'id'>
export type UpdateAreaRequest = Omit<AreaInfo, 'id'>

// ─── Holiday ──────────────────────────────────────────────────────────────────

export interface HolidayInfo {
  id: number
  name: string
  date: string
  isRecurring?: boolean
}

export type CreateHolidayRequest = Omit<HolidayInfo, 'id'>
export type UpdateHolidayRequest = Omit<HolidayInfo, 'id'>

// ─── Timezone ─────────────────────────────────────────────────────────────────

export interface TimezoneInfo {
  id: number
  name: string
  startTime: string
  endTime: string
  daysOfWeek?: number
}

export type CreateTimezoneRequest = Omit<TimezoneInfo, 'id'>
export type UpdateTimezoneRequest = Omit<TimezoneInfo, 'id'>

// ─── Card Format ──────────────────────────────────────────────────────────────

export interface CardfmtInfo {
  id: number
  name: string
  bitLength: number
  facilityCode?: number
  facilityBits?: number
  cardBits?: number
}

export type CreateCardfmtRequest = Omit<CardfmtInfo, 'id'>
export type UpdateCardfmtRequest = Omit<CardfmtInfo, 'id'>

// ─── Module ───────────────────────────────────────────────────────────────────

export interface ModuleInfo {
  id: string
  name: string
  type: string
  status: string
  version?: string
  description?: string
}

// ─── Management ───────────────────────────────────────────────────────────────

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

// ─── SSE ──────────────────────────────────────────────────────────────────────

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
