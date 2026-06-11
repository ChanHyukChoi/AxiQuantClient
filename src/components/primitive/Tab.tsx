export interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
}

interface TabProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
  fontSize?: number
}

export const Tab = ({ items, activeKey, onChange, fontSize = 15 }: TabProps) => {
  return (
    <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 cursor-pointer border-b-2 transition-colors"
            style={{
              color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
              borderColor: isActive ? 'var(--color-accent)' : 'transparent',
              background: 'transparent',
              fontSize,
            }}
          >
            {item.icon && <span className="flex items-center">{item.icon}</span>}
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
