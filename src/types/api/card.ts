export interface CardInfo {
  cid: number
  cardNumber: string
  name?: string
  empId?: number
  empName?: string
  isActive: boolean
  issuedAt?: string
  expiredAt?: string
  type?: string
  status?: string
  area?: string
  lastCtrl?: string
  lastReader?: string
  lastAccess?: string
  exemptApb?: boolean
  exemptPin?: boolean
}

export type CreateCardRequest = Omit<CardInfo, 'cid' | 'empName'>
export type UpdateCardRequest = Omit<CardInfo, 'cid' | 'empName'>

/** WPF 스펙: `cid`, `alvid`, `state`, `acttm`, `dacttm`, `ext` (camelCase) */
export interface CardAccLvInfo {
  cid: number
  alvid: number
  state?: number
  acttm?: string
  dacttm?: string
  ext?: string
}

export interface AddCardAccLvRequest {
  accLvId: number
}

/** 카드 영역 이동 요청 (서버 API 스펙 확정 후 필드 조정) */
export interface MoveCardAreaRequest {
  areaId: number
}
