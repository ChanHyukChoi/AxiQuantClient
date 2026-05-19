import { create } from 'zustand'

export type ToastVariant = 'success' | 'error'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

interface ToastState {
  toasts: ToastItem[]
  show: (message: string, variant?: ToastVariant) => void
  dismiss: (id: string) => void
}

let toastSeq = 0

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, variant = 'success') => {
    const id = `toast-${++toastSeq}`
    set((state) => ({ toasts: [...state.toasts, { id, message, variant }] }))
    window.setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
