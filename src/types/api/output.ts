export interface OutputInfo {
  scp: number
  id: number
  name: string
  active: number
  sio: number
  addr: number
  defpulse: number
  ext: string
  mode: number
}

export type CreateOutputRequest = Omit<OutputInfo, 'id' | 'scp'>
export type UpdateOutputRequest = Omit<OutputInfo, 'id' | 'scp'>
