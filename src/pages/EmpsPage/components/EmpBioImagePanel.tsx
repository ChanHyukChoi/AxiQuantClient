import { useRef, type CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import { Fingerprint, Minus, Plus } from 'lucide-react'
import { BIO_IMAGE_ACCEPT } from '@/lib/image/bioImageConstants'
import {
  EMP_DRAWER_PHOTO_HEIGHT,
  EMP_DRAWER_PHOTO_WIDTH,
} from '@/lib/image/empImageConstants'

const frameStyle: CSSProperties = {
  width: EMP_DRAWER_PHOTO_WIDTH,
  height: EMP_DRAWER_PHOTO_HEIGHT,
  border: '0.5px solid var(--color-border)',
  borderRadius: 4,
  background: 'var(--color-bg)',
}

interface EmpBioImagePanelProps {
  imageUrl?: string
  editable?: boolean
  loading?: boolean
  onFileSelect?: (file: File) => void
  onClear?: () => void
}

export const EmpBioImagePanel = ({
  imageUrl,
  editable = false,
  loading = false,
  onFileSelect,
  onClear,
}: EmpBioImagePanelProps) => {
  const { t } = useTranslation('emp')
  const inputRef = useRef<HTMLInputElement>(null)
  const trimmed = imageUrl?.trim()

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
      <div className="relative shrink-0 overflow-hidden rounded" style={frameStyle}>
        <img src={trimmed} alt="" className="w-full h-full object-cover" />
        {editable ? (
          <button
            type="button"
            aria-label={t('bio.removeImageAria')}
            disabled={loading}
            onClick={onClear}
            className="absolute top-0.5 left-0.5 flex items-center justify-center rounded"
            style={{
              width: 22,
              height: 22,
              background: 'color-mix(in srgb, var(--color-bg) 88%, transparent)',
              border: '0.5px solid var(--color-border)',
              color: 'var(--color-text)',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.5 : 1,
            }}
          >
            <Minus size={14} strokeWidth={2.5} />
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
          aria-label={t('bio.loadImageAria')}
          disabled={loading}
          onClick={openFileDialog}
          className="shrink-0 flex items-center justify-center rounded"
          style={{
            ...frameStyle,
            color: 'var(--color-accent)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1,
          }}
        >
          <Plus size={22} strokeWidth={2} />
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={BIO_IMAGE_ACCEPT}
          className="hidden"
          onChange={handleFileChange}
        />
      </>
    )
  }

  return (
    <div
      className="shrink-0 flex flex-col items-center justify-center gap-1 rounded text-center leading-tight"
      style={{
        ...frameStyle,
        color: 'var(--color-text-subtle)',
        fontSize: 14,
        padding: 8,
      }}
    >
      <Fingerprint size={22} style={{ color: 'var(--color-border)' }} />
      <span>{t('bio.noImage')}</span>
    </div>
  )
}
