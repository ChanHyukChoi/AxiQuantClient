export interface EmpInfo {
  id: number
  name: string
  name2: string
  lastName: string
  ssn: string
  birth: string
  company: number
  dept: number
  lv: number
  empType: number
  tel: string
  email: string
  addr: string
  udef: string
  /** 추후 사용자 사진 URL (wire 연동 전 placeholder) */
  photoUrl?: string
}

export type CreateEmpRequest = Omit<EmpInfo, 'id'>
export type UpdateEmpRequest = Omit<EmpInfo, 'id'>
