interface DetailInfoFieldProps {
  label: string
  children: React.ReactNode
  className?: string
}

/** 마스터–디테일 정보 패널 — 라벨 md(15px), 값 lg(16px) */
export const DetailInfoField = ({ label, children, className = '' }: DetailInfoFieldProps) => (
  <div className={className}>
    <span
      className="app-text-md block mb-1"
      style={{ color: 'var(--color-text-subtle)' }}
    >
      {label}
    </span>
    <div className="app-text-lg leading-snug" style={{ color: 'var(--color-text)' }}>
      {children}
    </div>
  </div>
)
