import { create } from 'zustand'
import { isElectronRuntime } from '@/lib/app/isElectronRuntime'

const isElectron = isElectronRuntime()

interface SidebarState {
  isElectron: boolean
  isCollapsed: boolean // Electron: 너비 접힘 여부 (false = 펼침)
  isOpen: boolean // Web: 사이드바 표시 여부 (false = 숨김)
  toggle: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isElectron,
  isCollapsed: false,
  isOpen: true,
  toggle: () => {
    if (isElectron) {
      set((state) => ({ isCollapsed: !state.isCollapsed }))
    } else {
      set((state) => ({ isOpen: !state.isOpen }))
    }
  },
}))
