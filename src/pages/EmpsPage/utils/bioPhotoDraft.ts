export type BioPhotoDraft =
  | { status: 'unchanged' }
  | { status: 'cleared' }
  | { status: 'loaded'; bytes: Uint8Array; previewUrl: string; mime: string }

export const createBioPhotoDraft = (): BioPhotoDraft => ({ status: 'unchanged' })

export const detectBioImageMime = (bytes: Uint8Array): string =>
  bytes.length >= 4 &&
  bytes[0] === 0x89 &&
  bytes[1] === 0x50 &&
  bytes[2] === 0x4e &&
  bytes[3] === 0x47
    ? 'image/png'
    : 'image/jpeg'

export const revokeBioPhotoPreview = (draft: BioPhotoDraft): void => {
  if (draft.status === 'loaded') URL.revokeObjectURL(draft.previewUrl)
}

export const cloneBioPhotoDraft = (draft: BioPhotoDraft): BioPhotoDraft => {
  if (draft.status !== 'loaded') return draft
  const bytes = Uint8Array.from(draft.bytes)
  const mime = draft.mime
  const previewUrl = URL.createObjectURL(new Blob([bytes], { type: mime }))
  return { status: 'loaded', bytes, previewUrl, mime }
}

export const createBioPhotoDraftFromBytes = (bytes: Uint8Array, mime: string): BioPhotoDraft => {
  const copied = Uint8Array.from(bytes)
  const previewUrl = URL.createObjectURL(new Blob([copied], { type: mime }))
  return { status: 'loaded', bytes: copied, previewUrl, mime }
}

export const resolveBioPhotoDisplayUrl = (
  editActive: boolean,
  draft: BioPhotoDraft,
  committed: BioPhotoDraft,
  baseBioUrl?: string,
): string | undefined => {
  const source = editActive ? draft : committed

  if (source.status === 'loaded') return source.previewUrl
  if (source.status === 'cleared') return undefined

  return baseBioUrl?.trim() || undefined
}

/** API wire 확정 후 — 바이오 저장 payload */
export const bioPhotoDraftForSave = (
  draft: BioPhotoDraft,
): 'unchanged' | 'cleared' | Uint8Array => {
  if (draft.status === 'loaded') return draft.bytes
  if (draft.status === 'cleared') return 'cleared'
  return 'unchanged'
}
