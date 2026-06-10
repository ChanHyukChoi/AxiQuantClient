import { getFileExtension } from '@/lib/image/isAllowedEmpImageFile'
import { BIO_IMAGE_ALLOWED_EXTENSIONS } from '@/lib/image/bioImageConstants'

const ALLOWED_SET = new Set<string>(BIO_IMAGE_ALLOWED_EXTENSIONS)

export const isAllowedBioImageFile = (file: File): boolean =>
  ALLOWED_SET.has(getFileExtension(file.name))
