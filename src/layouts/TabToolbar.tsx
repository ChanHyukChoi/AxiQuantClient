import type { ReactNode } from 'react'

interface TabToolbarProps {
  children: ReactNode
}

export const TabToolbar = ({ children }: TabToolbarProps) => (
  <div
    className="flex flex-shrink-0 items-center justify-end px-3 py-2"
    style={{ borderBottom: '0.5px solid var(--color-border)' }}
  >
    {children}
  </div>
)
