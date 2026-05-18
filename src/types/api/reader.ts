export interface ReaderInfo {
  scp: number
  id: number
  name: string
  active: number
  sio: number
  addr: number
  dtfmt: number
  kpadmode: number
  ledmode: number
  osdpflag: number
  accfg: number
  pairacr: number
  cdfmt: number
  apbmode: number
  apbin: number
  apbto: number
  spare: number
  actlflag: number
  offmode: number
  defmode: number
  defledmode: number
  prealarm: number
  apbdelay: number
  mask: number
  ext: string
  args: string
}

export type CreateReaderRequest = Omit<ReaderInfo, 'id' | 'scp'>
export type UpdateReaderRequest = Omit<ReaderInfo, 'id' | 'scp'>
