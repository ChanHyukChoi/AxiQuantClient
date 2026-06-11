import { useNavigate, useRouterState } from '@tanstack/react-router'

export interface PageVariantPaths {
  a: string
  b: string
}

interface PageVariantToggleProps {
  paths: PageVariantPaths
}

const segmentStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--color-accent-subtle)' : 'transparent',
  color: active ? 'var(--color-accent)' : 'var(--color-text-subtle)',
})

export const PageVariantToggle = ({ paths }: PageVariantToggleProps) => {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isB = pathname === paths.b

  return (
    <div
      className="flex shrink-0 rounded overflow-hidden ml-1"
      style={{ border: '0.5px solid var(--color-border)' }}
      role="group"
      aria-label="레이아웃 전환"
    >
      <button
        type="button"
        title="레이아웃 A"
        onClick={() => navigate({ href: paths.a })}
        className="px-2.5 py-1 app-text-sm font-medium transition-colors"
        style={segmentStyle(!isB)}
      >
        A
      </button>
      <button
        type="button"
        title="레이아웃 B"
        onClick={() => navigate({ href: paths.b })}
        className="px-2.5 py-1 app-text-sm font-medium transition-colors"
        style={{
          ...segmentStyle(isB),
          borderLeft: '0.5px solid var(--color-border)',
        }}
      >
        B
      </button>
    </div>
  )
}
