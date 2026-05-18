export interface InputInfo {
  scp: number
  id: number
  name: string
  active: number
  sio: number
  addr: number
  ifcode: number
  mode: number
  delayentry: number
  delayexit: number
  ext: string
  icvt: number
  debounce: number
  holdtime: number
}

export type CreateInputRequest = Omit<InputInfo, 'id' | 'scp'>
export type UpdateInputRequest = Omit<InputInfo, 'id' | 'scp'>
