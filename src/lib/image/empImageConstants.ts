/** WPF CardHolderPage OpenFileDialog — jpg, jpeg, png, gif, bmp */
export const EMP_IMAGE_ACCEPT = '.jpg,.jpeg,.png,.gif,.bmp'

export const EMP_IMAGE_ALLOWED_EXTENSIONS = [
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.bmp',
] as const

/** 드로어 헤더·바이오 탭 미리보기 공통 슬롯 (EmpPhotoSlot drawer) */
export const EMP_DRAWER_PHOTO_WIDTH = 88
export const EMP_DRAWER_PHOTO_HEIGHT = 110

/** WPF ImageHelper.ResizeByMinSide — UI 직접 선택 기준 */
export const EMP_IMAGE_MIN_SIDE_PX = 160

/** WPF ConvertToJpegHighQuality quality=100 */
export const EMP_IMAGE_JPEG_QUALITY = 1

export const EMP_IMAGE_INVALID_EXTENSION_MESSAGE =
  '이미지 파일만 선택할 수 있습니다.\n허용 확장자: jpg, jpeg, png, gif, bmp'

export const EMP_IMAGE_PROCESS_ERROR_MESSAGE =
  '이미지를 불러오거나 가공하지 못했습니다. 다른 파일을 선택해 주세요.'
