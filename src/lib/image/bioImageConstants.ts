/** WPF BioInfoRegistrationWindow — jpg, jpeg, png 만 허용 */
export const BIO_IMAGE_ACCEPT = '.jpg,.jpeg,.png'

export const BIO_IMAGE_ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'] as const

/** WPF 생체등록 — 가로·세로 모두 160px 이상 */
export const BIO_IMAGE_MIN_DIMENSION_PX = 160

export const BIO_IMAGE_INVALID_EXTENSION_MESSAGE =
  '바이오 이미지는 jpg, jpeg, png 파일만 선택할 수 있습니다.'

export const BIO_IMAGE_TOO_SMALL_MESSAGE = `이미지 크기는 가로·세로 모두 ${BIO_IMAGE_MIN_DIMENSION_PX}px 이상이어야 합니다.`

export const BIO_IMAGE_PROCESS_ERROR_MESSAGE =
  '바이오 이미지를 불러오거나 처리하지 못했습니다. 다른 파일을 선택해 주세요.'

export const BIO_NO_PROFILE_MESSAGE = '가져올 프로필 이미지가 없습니다.'

export const BIO_NO_REP_CARD_MESSAGE = '바이오 등록에는 대표카드가 필요합니다.'
