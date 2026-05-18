export interface CardfmtInfo {
  id: number
  name: string
  facility: number
  idOffset: number
  funcId: number
  flags: number
  totalBits: number
  evenBits: number
  evenLoc: number
  oddBits: number
  oddLoc: number
  fcBits: number
  fcLoc: number
  cardBits: number
  cardLoc: number
  issueBits: number
  issueLoc: number
  minDigits: number
  maxDigits: number
  ext: string
}

export type CreateCardfmtRequest = Omit<CardfmtInfo, 'id'>
export type UpdateCardfmtRequest = Omit<CardfmtInfo, 'id'>
