import type { CreateEmpRequest, EmpInfo } from '@/types/api'

/** 숫자 필드에 NaN이 들어가면 JSON에서 null이 되어 ASP.NET 등에서 역직렬화/DB 저장 시 500이 날 수 있음 */
const asInt = (n: unknown): number => {
  if (typeof n === 'number') return Number.isFinite(n) ? Math.trunc(n) : 0
  if (typeof n === 'string' && n.trim() !== '') {
    const x = Number(n)
    return Number.isFinite(x) ? Math.trunc(x) : 0
  }
  return 0
}

const str = (v: unknown) => (v == null ? '' : String(v))

/**
 * WPF `EmployeesView` → `EmpEditModel.ToInfo`: 신규·수정 모두 `udef`는 항상 `"{}"`.
 * `System.Text.Json` 기본으로 키 생략 없이 한 객체에 14개 프로퍼티를 맞춘다.
 */
export type EmpWirePayload = {
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
}

export const buildEmpWirePayload = (emp: CreateEmpRequest, id: number): EmpWirePayload => ({
  id,
  name: str(emp.name),
  name2: str(emp.name2),
  lastName: str(emp.lastName),
  ssn: str(emp.ssn),
  birth: str(emp.birth),
  company: asInt(emp.company),
  dept: asInt(emp.dept),
  lv: asInt(emp.lv),
  empType: asInt(emp.empType),
  tel: str(emp.tel),
  email: str(emp.email),
  addr: str(emp.addr),
  udef: '{}',
})

export const isDeletedEmp = (row: EmpInfo | Record<string, unknown>): boolean => {
  if (typeof row !== 'object' || row === null) return false
  const d = (row as Record<string, unknown>).deleted
  return d === true || d === 1 || d === '1'
}
