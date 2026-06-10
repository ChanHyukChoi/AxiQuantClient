export type EmpPhotoDraft =
  | { status: 'unchanged' }
  | { status: 'cleared' }
  | { status: 'loaded'; bytes: Uint8Array; previewUrl: string }

export const createEmpPhotoDraft = (): EmpPhotoDraft => ({ status: 'unchanged' })

export const revokeEmpPhotoPreview = (draft: EmpPhotoDraft): void => {
  if (draft.status === 'loaded') URL.revokeObjectURL(draft.previewUrl)
}

export const resolveEmpPhotoDisplayUrl = (
  formActive: boolean,
  draft: EmpPhotoDraft,
  basePhotoUrl?: string,
): string | undefined => {
  if (!formActive) return basePhotoUrl?.trim() || undefined

  if (draft.status === 'loaded') return draft.previewUrl
  if (draft.status === 'cleared') return undefined

  return basePhotoUrl?.trim() || undefined
}

/** API wire 필드 확정 후 저장 payload에 포함 — 현재는 로컬 draft만 유지 */
export const empPhotoDraftForSave = (
  draft: EmpPhotoDraft,
): 'unchanged' | 'cleared' | Uint8Array => {
  if (draft.status === 'loaded') return draft.bytes
  if (draft.status === 'cleared') return 'cleared'
  return 'unchanged'
}
