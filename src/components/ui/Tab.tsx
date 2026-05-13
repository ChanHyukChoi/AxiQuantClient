export interface TabItem {
  key: string
  label: string
  icon?: React.ReactNode
}

interface TabProps {
  items: TabItem[]
  activeKey: string
  onChange: (key: string) => void
}

export const Tab = ({ items, activeKey, onChange }: TabProps) => {
  return (
    <div
      className="flex border-b"
      style={{ borderColor: '#2a2d32' }}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[11px] cursor-pointer border-b-2 transition-colors"
            style={{
              color: isActive ? 'var(--color-accent)' : '#555a63',
              borderColor: isActive ? 'var(--color-accent)' : 'transparent',
              background: 'transparent',
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
