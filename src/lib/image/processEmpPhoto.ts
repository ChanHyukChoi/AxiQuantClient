import {
  EMP_IMAGE_JPEG_QUALITY,
  EMP_IMAGE_MIN_SIDE_PX,
} from '@/lib/image/empImageConstants'

/**
 * WPF CardHolderPage UI 경로:
 * ConvertToJpegHighQuality(q=100) → ResizeByMinSide(160) → EXIF Orientation 보정
 *
 * 브라우저: createImageBitmap(imageOrientation: 'from-image')로 EXIF 보정 후
 * canvas JPEG 인코딩·리사이즈.
 */
export const processEmpPhoto = async (file: File): Promise<Uint8Array> => {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

  try {
    const { width, height } = bitmap
    const minSide = Math.min(width, height)
    const scale = minSide > EMP_IMAGE_MIN_SIDE_PX ? EMP_IMAGE_MIN_SIDE_PX / minSide : 1
    const targetWidth = Math.max(1, Math.round(width * scale))
    const targetHeight = Math.max(1, Math.round(height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context unavailable')

    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result)
          else reject(new Error('JPEG encoding failed'))
        },
        'image/jpeg',
        EMP_IMAGE_JPEG_QUALITY,
      )
    })

    return new Uint8Array(await blob.arrayBuffer())
  } finally {
    bitmap.close()
  }
}
