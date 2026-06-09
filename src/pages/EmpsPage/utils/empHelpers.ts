import { formatEmpBirthForForm } from '@/lib/mappers/empsMappers'
import type { SelectOption } from '@/components/primitive/Select'
import type { CreateEmpFormValues } from '@/pages/EmpsPage/formTypes'
import type { CreateEmpRequest, EmpInfo, UpdateEmpRequest } from '@/types/api'

export const EMP_NONE_OPTION_VALUE = '0'

export const EMP_DEPT_OPTIONS: SelectOption[] = [
  { value: EMP_NONE_OPTION_VALUE, label: '선택안함' },
]

export const EMP_LV_OPTIONS: SelectOption[] = [
  { value: EMP_NONE_OPTION_VALUE, label: '선택안함' },
]

export const empDeptLabel = (dept: number): string =>
  dept !== 0 ? String(dept) : '선택안함'

export const empLvLabel = (lv: number): string => (lv !== 0 ? String(lv) : '선택안함')

export const empToUpdatePayload = (emp: EmpInfo): UpdateEmpRequest => {
  const { id, ...rest } = emp
  void id
  return rest
}

export const empToFormValues = (emp: EmpInfo): CreateEmpFormValues => ({
  name: emp.name,
  name2: emp.name2,
  lastName: emp.lastName,
  empNo: '',
  birth: formatEmpBirthForForm(emp.birth),
  dept: emp.dept,
  lv: emp.lv,
  tel: emp.tel,
  email: emp.email,
})

export const toCreateRequest = (values: CreateEmpFormValues): CreateEmpRequest => ({
  name: values.name,
  name2: values.name2 ?? '',
  lastName: values.lastName ?? '',
  ssn: '',
  birth: values.birth ?? '',
  company: 0,
  dept: values.dept ?? 0,
  lv: values.lv ?? 0,
  empType: 0,
  tel: values.tel ?? '',
  email: values.email ?? '',
  addr: '',
  udef: '{}',
})

export const toUpdateRequest = (
  values: CreateEmpFormValues,
  base: EmpInfo,
): UpdateEmpRequest => ({
  ...empToUpdatePayload(base),
  name: values.name,
  name2: values.name2 ?? '',
  lastName: values.lastName ?? '',
  birth: values.birth ?? '',
  dept: values.dept ?? 0,
  lv: values.lv ?? 0,
  tel: values.tel ?? '',
  email: values.email ?? '',
})

export const findCreatedEmpId = (
  emps: EmpInfo[],
  values: CreateEmpFormValues,
  beforeIds: Set<number>,
): number | null => {
  const match = emps.find(
    (e) =>
      !beforeIds.has(e.id) &&
      e.name === values.name &&
      e.dept === (values.dept ?? 0) &&
      e.tel === (values.tel ?? '') &&
      e.email === (values.email ?? ''),
  )
  if (match) return match.id

  const newcomers = emps.filter((e) => !beforeIds.has(e.id))
  if (newcomers.length === 1) return newcomers[0].id
  return null
}
