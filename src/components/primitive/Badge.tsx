interface BadgeProps {
  variant?: 'on' | 'off' | 'lost' | 'visit' | 'issue' | 'card'
  children: React.ReactNode
}

const FONT_SIZE = 15

const variantStyle: Record<NonNullable<BadgeProps['variant']>, React.CSSProperties> = {
  on: {
    background: 'var(--badge-on-bg)',
    color: 'var(--badge-on-text)',
    fontSize: FONT_SIZE,
  },
  off: {
    background: 'var(--badge-off-bg)',
    color: 'var(--badge-off-text)',
    fontSize: FONT_SIZE,
  },
  lost: {
    background: 'var(--badge-lost-bg)',
    color: 'var(--badge-lost-text)',
    fontSize: FONT_SIZE,
  },
  visit: {
    background: 'var(--badge-visit-bg)',
    color: 'var(--badge-visit-text)',
    fontSize: FONT_SIZE,
  },
  issue: {
    background: 'var(--badge-issue-bg)',
    color: 'var(--badge-issue-text)',
    fontSize: FONT_SIZE,
  },
  card: {
    background: 'var(--badge-card-bg)',
    color: 'var(--badge-card-text)',
    fontSize: FONT_SIZE,
  },
}

export const Badge = ({ variant = 'off', children }: BadgeProps) => (
  <span
    style={variantStyle[variant]}
    className="inline-flex items-center font-medium px-1.5 py-0.5 rounded-full"
  >
    {children}
  </span>
)
