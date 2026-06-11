import type { ReaderTabDef } from '@/pages/ReadersPage/utils/readerDisplay'

interface ReaderTabRailProps {
  tabs: ReaderTabDef[]
  activeTab: string
  onChange: (key: string) => void
}

export const ReaderTabRail = ({ tabs, activeTab, onChange }: ReaderTabRailProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-y-auto app-scrollbar"
    style={{
      width: 88,
      borderRight: '0.5px solid var(--color-border)',
      background: 'var(--color-sidebar)',
    }}
  >
    {tabs.map((tab) => {
      const active = tab.key === activeTab
      return (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className="text-left px-3 py-2.5 text-[13px] transition-colors"
          style={{
            color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
            background: active ? 'var(--color-accent-subtle)' : 'transparent',
            borderRight: active ? '2px solid var(--color-accent)' : '2px solid transparent',
            borderBottom: '0.5px solid var(--color-border-subtle)',
          }}
        >
          {tab.label}
        </button>
      )
    })}
  </div>
)
