import { X } from 'lucide-react'
import { useToastStore } from '@/stores/toastStore'

export const ToastHost = () => {
  const { toasts, dismiss } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      style={{ maxWidth: 360 }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-2 rounded-md px-3 py-2.5 shadow-lg text-[12px]"
          style={{
            background: 'var(--color-sidebar)',
            border: '0.5px solid var(--color-border)',
            color: 'var(--color-text)',
            borderLeft: `3px solid ${toast.variant === 'success' ? '#4caf7d' : '#e06060'}`,
          }}
          role="status"
        >
          <span className="flex-1 leading-snug">{toast.message}</span>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="flex-shrink-0 p-0 border-0 bg-transparent cursor-pointer"
            style={{ color: 'var(--color-text-dim)' }}
            aria-label="닫기"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
