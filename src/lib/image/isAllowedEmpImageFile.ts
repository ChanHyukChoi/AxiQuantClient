import { EMP_IMAGE_ALLOWED_EXTENSIONS } from '@/lib/image/empImageConstants'

const ALLOWED_SET = new Set<string>(EMP_IMAGE_ALLOWED_EXTENSIONS)

export const getFileExtension = (fileName: string): string => {
  const lower = fileName.trim().toLowerCase()
  const dot = lower.lastIndexOf('.')
  if (dot < 0) return ''
  return lower.slice(dot)
}

export const isAllowedEmpImageFile = (file: File): boolean =>
  ALLOWED_SET.has(getFileExtension(file.name))
