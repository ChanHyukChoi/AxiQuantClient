import { create } from 'zustand'

interface AuthState {
  token: string | null
  loginId: string | null
  isAuthenticated: boolean
  setAuth: (token: string, loginId: string) => void
  clearToken: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  loginId: null,
  isAuthenticated: false,
  setAuth: (token, loginId) => set({ token, loginId, isAuthenticated: true }),
  clearToken: () => set({ token: null, loginId: null, isAuthenticated: false }),
}))
