export type ReaderControlAction = 'open' | 'lock' | 'alarm'

export type OutputControlAction = 'pulse' | 'on' | 'off'

export interface ReaderControlRequest {
  action: ReaderControlAction
}

export interface OutputControlRequest {
  action: OutputControlAction
}
