import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteEmpBio, deleteEmpPhoto, updateEmpBio, updateEmpPhoto } from '@/api/empMedia'
import { queryKeys } from '@/lib/query/queryKeys'

export type EmpPhotoSyncPayload = 'unchanged' | 'cleared' | Uint8Array

export type EmpBioSyncPayload =
  | { kind: 'unchanged' }
  | { kind: 'cleared' }
  | { kind: 'bytes'; bytes: Uint8Array; mime: string }

const applyEmpPhotoSync = async (
  empId: number,
  payload: EmpPhotoSyncPayload,
): Promise<string | null> => {
  if (payload === 'unchanged') return null
  if (payload === 'cleared') {
    const result = await deleteEmpPhoto(empId)
    return result.ok ? null : result.message
  }
  const result = await updateEmpPhoto(empId, payload)
  return result.ok ? null : result.message
}

const applyEmpBioSync = async (
  empId: number,
  payload: EmpBioSyncPayload,
): Promise<string | null> => {
  if (payload.kind === 'unchanged') return null
  if (payload.kind === 'cleared') {
    const result = await deleteEmpBio(empId)
    return result.ok ? null : result.message
  }
  const result = await updateEmpBio(empId, payload.bytes, payload.mime)
  return result.ok ? null : result.message
}

export const useSyncEmpPhoto = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ empId, payload }: { empId: number; payload: EmpPhotoSyncPayload }) =>
      applyEmpPhotoSync(empId, payload),
    onSuccess: (errorMessage) => {
      if (errorMessage === null) {
        void qc.invalidateQueries({ queryKey: queryKeys.emps.all })
      }
    },
  })
}

export const useSyncEmpBio = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ empId, payload }: { empId: number; payload: EmpBioSyncPayload }) =>
      applyEmpBioSync(empId, payload),
    onSuccess: (errorMessage) => {
      if (errorMessage === null) {
        void qc.invalidateQueries({ queryKey: queryKeys.emps.all })
      }
    },
  })
}
