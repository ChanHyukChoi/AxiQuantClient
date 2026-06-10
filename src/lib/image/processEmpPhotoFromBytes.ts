import { processEmpPhoto } from '@/lib/image/processEmpPhoto'

/** 바이오 이미지 → 프로필 저장용 재가공 (processEmpPhoto와 동일 규칙) */
export const processEmpPhotoFromBytes = async (bytes: Uint8Array): Promise<Uint8Array> => {
  const blob = new Blob([Uint8Array.from(bytes)], { type: 'image/jpeg' })
  const file = new File([blob], 'profile.jpg', { type: blob.type || 'image/jpeg' })
  return processEmpPhoto(file)
}
