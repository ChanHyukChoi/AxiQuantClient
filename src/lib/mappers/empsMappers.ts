import { asRecordArray, firstNumber, pickString } from '@/lib/wire/wireJson'
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

/** 서버 DB date 컬럼이 빈 문자열을 거부할 때 API 전송용 (proto는 빈 문자열 허용) */
export const EMP_BIRTH_PLACEHOLDER = '1900-01-01'

const BIRTH_WIRE_RE = /^\d{4}-\d{2}-\d{2}$/

/** proto `yyyy-MM-dd` — 미입력 시 placeholder */
export const normalizeEmpBirthForWire = (birth: unknown): string => {
  const t = str(birth).trim()
  if (BIRTH_WIRE_RE.test(t)) return t
  return EMP_BIRTH_PLACEHOLDER
}

/** 폼 표시 — placeholder는 빈 칸으로 */
export const formatEmpBirthForForm = (birth: string | undefined): string => {
  const t = birth?.trim() ?? ''
  if (!t || t === EMP_BIRTH_PLACEHOLDER) return ''
  return t
}

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
  birth: normalizeEmpBirthForWire(emp.birth),
  company: asInt(emp.company),
  dept: asInt(emp.dept),
  lv: asInt(emp.lv),
  empType: asInt(emp.empType),
  tel: str(emp.tel),
  email: str(emp.email),
  addr: str(emp.addr),
  udef: '{}',
})

const normalizeEmpRow = (row: Record<string, unknown>): Record<string, unknown> => {
  const nested = row.emp ?? row.employee
  if (nested != null && typeof nested === 'object' && !Array.isArray(nested)) {
    return nested as Record<string, unknown>
  }
  return row
}

const extractEmpRows = (data: unknown): Record<string, unknown>[] => {
  if (data == null) return []
  if (Array.isArray(data)) return asRecordArray(data).map(normalizeEmpRow)
  if (typeof data !== 'object') return []
  const o = data as Record<string, unknown>
  const nested = o.items ?? o.data ?? o.emps ?? o.employees ?? o.list ?? o.values ?? o.results
  if (nested != null) return asRecordArray(nested).map(normalizeEmpRow)
  if (Array.isArray(o.emp)) return asRecordArray(o.emp).map(normalizeEmpRow)
  return []
}

export const wireToEmpInfo = (row: Record<string, unknown>): EmpInfo => ({
  id: firstNumber(row, ['id', 'empId', 'emp', 'eid']),
  name: pickString(row, ['name', 'Name']) ?? '',
  name2: pickString(row, ['name2', 'Name2']) ?? '',
  lastName: pickString(row, ['lastName', 'LastName']) ?? '',
  ssn: pickString(row, ['ssn', 'Ssn', 'SSN']) ?? '',
  birth: pickString(row, ['birth', 'Birth']) ?? '',
  company: firstNumber(row, ['company', 'Company']),
  dept: firstNumber(row, ['dept', 'Dept']),
  lv: firstNumber(row, ['lv', 'Lv']),
  empType: firstNumber(row, ['empType', 'EmpType']),
  tel: pickString(row, ['tel', 'Tel']) ?? '',
  email: pickString(row, ['email', 'Email']) ?? '',
  addr: pickString(row, ['addr', 'Addr']) ?? '',
  udef: pickString(row, ['udef', 'Udef']) ?? '{}',
})

/** UI 표시용 — name 비어 있으면 lastName·name2 조합 */
export const empDisplayName = (emp: Pick<EmpInfo, 'id' | 'name' | 'lastName' | 'name2'>): string => {
  const primary = emp.name?.trim()
  if (primary) return primary
  const parts = [emp.lastName?.trim(), emp.name2?.trim()].filter(Boolean)
  if (parts.length > 0) return parts.join(' ')
  return emp.id > 0 ? `사용자 #${emp.id}` : ''
}

export const isDeletedEmp = (row: EmpInfo | Record<string, unknown>): boolean => {
  if (typeof row !== 'object' || row === null) return false
  const r = row as Record<string, unknown>
  const d = r.deleted ?? r.Deleted
  return d === true || d === 1 || d === '1'
}

export type EmpListParseStats = {
  rawRowCount: number
  mappedCount: number
  deletedFiltered: number
  invalidIdFiltered: number
  emptyNameFiltered: number
}

export const parseEmpListWithStats = (
  data: unknown,
): { items: EmpInfo[]; stats: EmpListParseStats } => {
  const rows = extractEmpRows(data)
  const mapped = rows.map(wireToEmpInfo)
  const deletedFiltered = mapped.filter((e) => isDeletedEmp(e)).length

  const items = mapped.filter((e) => {
    if (isDeletedEmp(e)) return false
    if (e.id <= 0) return false
    if (!empDisplayName(e)) return false
    return true
  })

  const invalidIdFiltered = mapped.filter((e) => !isDeletedEmp(e) && e.id <= 0).length
  const emptyNameFiltered = mapped.filter(
    (e) => !isDeletedEmp(e) && e.id > 0 && !empDisplayName(e),
  ).length

  return {
    items,
    stats: {
      rawRowCount: rows.length,
      mappedCount: mapped.length,
      deletedFiltered,
      invalidIdFiltered,
      emptyNameFiltered,
    },
  }
}

export const parseEmpList = (data: unknown): EmpInfo[] => parseEmpListWithStats(data).items
