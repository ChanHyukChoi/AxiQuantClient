import { useEffect } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'danger'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const Modal = ({
  open,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="rounded-md p-5 min-w-[280px] max-w-[400px] w-full"
        style={{
          background: 'var(--color-sidebar)',
          border: '0.5px solid #2a2d32',
        }}
      >
        <p
          className="text-[13px] font-medium"
          style={{ color: 'var(--color-text)' }}
        >
          {title}
        </p>

        {description && (
          <p
            className="text-[12px] mt-2"
            style={{ color: 'var(--color-text-muted)' }}
          >
            {description}
          </p>
        )}

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="default" size="md" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} size="md" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
