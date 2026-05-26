import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  icon?: ReactNode
  actions?: ReactNode
  /** default 50px � CardsPage baseline */
  height?: number
}

export const PageHeader = ({ title, icon, actions, height = 50 }: PageHeaderProps) => (
  <header
    className="flex items-center justify-between shrink-0 px-3 select-none"
    style={{
      height,
      background: 'var(--color-sidebar)',
      boxShadow: 'inset 0 -0.5px 0 var(--color-border)',
    }}
  >
    <div className="flex items-center gap-1.5 min-w-0">
      {icon != null && (
        <span
          className="shrink-0 flex items-center"
          style={{ color: 'var(--color-accent)' }}
        >
          {icon}
        </span>
      )}
      <h1 className="text-[16px] truncate" style={{ color: 'var(--color-text)' }}>
        {title}
      </h1>
    </div>

    {actions != null && (
      <div className="flex items-center gap-1.5 shrink-0">{actions}</div>
    )}
  </header>
)
