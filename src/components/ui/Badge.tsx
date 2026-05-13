interface BadgeProps {
  variant?: 'on' | 'off' | 'lost' | 'visit' | 'issue' | 'card'
  children: React.ReactNode
}

const variantStyle: Record<
  NonNullable<BadgeProps['variant']>,
  { background: string; color: string }
> = {
  on: { background: '#0d2b1a', color: '#4caf7d' },
  off: { background: '#222428', color: '#555a63' },
  lost: { background: '#2b1616', color: '#e06060' },
  visit: { background: '#1e1a2e', color: '#7f77dd' },
  issue: { background: '#172135', color: '#4f9cf9' },
  card: { background: '#1e1a2e', color: '#7f77dd' },
}

export const Badge = ({ variant = 'off', children }: BadgeProps) => {
  const { background, color } = variantStyle[variant]

  return (
    <span
      style={{ background, color }}
      className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-full"
    >
      {children}
    </span>
  )
}
