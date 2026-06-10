import { useRef, type CSSProperties } from 'react'
import { Minus, Plus } from 'lucide-react'
import {
  EMP_DRAWER_PHOTO_HEIGHT,
  EMP_DRAWER_PHOTO_WIDTH,
  EMP_IMAGE_ACCEPT,
} from '@/lib/image/empImageConstants'

type EmpPhotoSlotVariant = 'grid' | 'drawer'

const SLOT_SIZE: Record<EmpPhotoSlotVariant, { width: number; height: number }> = {
  grid: { width: 36, height: 44 },
  drawer: { width: EMP_DRAWER_PHOTO_WIDTH, height: EMP_DRAWER_PHOTO_HEIGHT },
}

const slotFrameStyle = (width: number, height: number): CSSProperties => ({
  width,
  height,
  border: '0.5px solid var(--color-border)',
  background: 'var(--color-bg)',
})

interface EmpPhotoSlotProps {
  photoUrl?: string
  variant?: EmpPhotoSlotVariant
  editable?: boolean
  loading?: boolean
  onFileSelect?: (file: File) => void
  onClear?: () => void
}

export const EmpPhotoSlot = ({
  photoUrl,
  variant = 'grid',
  editable = false,
  loading = false,
  onFileSelect,
  onClear,
}: EmpPhotoSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const { width, height } = SLOT_SIZE[variant]
  const trimmed = photoUrl?.trim()
  const iconSize = variant === 'drawer' ? 22 : 14

  const openFileDialog = () => {
    if (!editable || loading) return
    inputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file || !onFileSelect) return
    onFileSelect(file)
  }

  if (trimmed) {
    return (
      <div
        className="relative shrink-0 overflow-hidden rounded"
        style={slotFrameStyle(width, height)}
      >
        <img src={trimmed} alt="" className="w-full h-full object-cover" />
        {editable ? (
          <button
            type="button"
            aria-label="이미지 제거"
            disabled={loading}
            onClick={onClear}
            className="absolute top-0.5 left-0.5 flex items-center justify-center rounded"
            style={{
              width: variant === 'drawer' ? 22 : 16,
              height: variant === 'drawer' ? 22 : 16,
              background: 'color-mix(in srgb, var(--color-bg) 88%, transparent)',
              border: '0.5px solid var(--color-border)',
              color: 'var(--color-text)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <Minus size={variant === 'drawer' ? 14 : 10} strokeWidth={2.5} />
          </button>
        ) : null}
      </div>
    )
  }

  if (editable) {
    return (
      <>
        <button
          type="button"
          aria-label="이미지 불러오기"
          disabled={loading}
          onClick={openFileDialog}
          className="shrink-0 flex items-center justify-center rounded"
          style={{
            ...slotFrameStyle(width, height),
            color: 'var(--color-accent)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          <Plus size={iconSize} strokeWidth={2} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={EMP_IMAGE_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />
      </>
    )
  }

  return (
    <div
      className="shrink-0 flex items-center justify-center rounded text-center leading-tight"
      style={{
        ...slotFrameStyle(width, height),
        color: 'var(--color-text-subtle)',
        fontSize: variant === 'drawer' ? 12 : 9,
        padding: variant === 'drawer' ? 8 : 2,
      }}
    >
      No Image
    </div>
  )
}
