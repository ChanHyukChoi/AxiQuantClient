import {
  BIO_IMAGE_MIN_DIMENSION_PX,
  BIO_IMAGE_TOO_SMALL_MESSAGE,
} from '@/lib/image/bioImageConstants'

export class BioImageTooSmallError extends Error {
  constructor() {
    super(BIO_IMAGE_TOO_SMALL_MESSAGE)
    this.name = 'BioImageTooSmallError'
  }
}

/**
 * WPF BioInfoRegistrationWindow:
 * jpg/jpeg/png만 허용, EXIF 보정 후 가로·세로 모두 160px 미만이면 거부.
 * (프로필과 달리 리사이즈·JPEG 강제 변환 없음 — 원본 크기 유지)
 */
export const processBioPhoto = async (file: File): Promise<Uint8Array> => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

  try {
    const { width, height } = bitmap
    if (width < BIO_IMAGE_MIN_DIMENSION_PX || height < BIO_IMAGE_MIN_DIMENSION_PX) {
      throw new BioImageTooSmallError()
    }

    const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png')
    const mime = isPng ? 'image/png' : 'image/jpeg'
    const quality = mime === 'image/jpeg' ? 1 : undefined

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result)
          else reject(new Error('Image encoding failed'))
        },
        mime,
        quality,
      )
    })

    return new Uint8Array(await blob.arrayBuffer())
  } finally {
    bitmap.close()
  }
}
