interface DetailTitleBarProps {
  icon?: React.ReactNode
  title: React.ReactNode
  badge?: React.ReactNode
  actions?: React.ReactNode
}

export const DetailTitleBar = ({ icon, title, badge, actions }: DetailTitleBarProps) => (
  <div
    className="flex-shrink-0 flex items-center justify-between gap-2 px-3 py-2"
    style={{ borderBottom: '0.5px solid var(--color-border)' }}
  >
    <div className="flex items-center gap-2 min-w-0 flex-1">
      {icon ? <span className="shrink-0 flex items-center">{icon}</span> : null}
      <div className="min-w-0 flex-1 text-[15px] font-medium truncate" style={{ color: 'var(--color-text)' }}>
        {title}
      </div>
      {badge ? <span className="shrink-0">{badge}</span> : null}
    </div>
    {actions ? <div className="shrink-0">{actions}</div> : null}
  </div>
)
