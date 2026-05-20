interface BadgeProps {
  variant?: 'on' | 'off' | 'lost' | 'visit' | 'issue' | 'card'
  children: React.ReactNode
}

const variantStyle: Record<NonNullable<BadgeProps['variant']>, React.CSSProperties> = {
  on:    { background: 'var(--badge-on-bg)',    color: 'var(--badge-on-text)' },
  off:   { background: 'var(--badge-off-bg)',   color: 'var(--badge-off-text)' },
  lost:  { background: 'var(--badge-lost-bg)',  color: 'var(--badge-lost-text)' },
  visit: { background: 'var(--badge-visit-bg)', color: 'var(--badge-visit-text)' },
  issue: { background: 'var(--badge-issue-bg)', color: 'var(--badge-issue-text)' },
  card:  { background: 'var(--badge-card-bg)',  color: 'var(--badge-card-text)' },
}

export const Badge = ({ variant = 'off', children }: BadgeProps) => (
  <span
    style={variantStyle[variant]}
    className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full"
  >
    {children}
  </span>
)
