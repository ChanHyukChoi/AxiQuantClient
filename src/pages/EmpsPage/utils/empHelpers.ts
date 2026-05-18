import type { EmpInfo, UpdateEmpRequest } from '@/types/api'

export const empToUpdatePayload = (emp: EmpInfo): UpdateEmpRequest => {
  const { id, ...rest } = emp
  void id
  return rest
}
