import { Tab } from './Tab'
import type { TabItem } from './Tab'

interface DrawerProps {
  width?: number
  /** true면 가로로 남은 공간을 채움 (고정 width 대신 flex-1) */
  fill?: boolean
  className?: string
  header: React.ReactNode
  tabs?: TabItem[]
  activeTab?: string
  onTabChange?: (key: string) => void
  actions?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
  fontSize?: number
}

export const Drawer = ({
  width,
  fill = false,
  className = '',
  header,
  tabs,
  activeTab = '',
  onTabChange,
  actions,
  footer,
  children,
  fontSize = 15,
}: DrawerProps) => {
  return (
    <div
      className={[
        fill
          ? 'flex flex-col flex-1 min-w-0 overflow-hidden'
          : 'flex flex-col flex-shrink-0 overflow-hidden h-full w-full',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...(fill ? {} : { width }),
        background: 'var(--color-sidebar)',
        borderLeft: '0.5px solid var(--color-border)',
      }}
    >
      {/* header */}
      <div className="flex-shrink-0 p-3 pb-0">{header}</div>

      {/* actions */}
      {actions && (
        <div className="flex-shrink-0 flex items-center justify-end gap-1.5 px-3 mb-2 mt-2">
          {actions}
        </div>
      )}

      {/* tabs */}
      {tabs && tabs.length > 0 && onTabChange && (
        <div className="flex-shrink-0">
          <Tab
            items={tabs}
            activeKey={activeTab}
            onChange={onTabChange}
            fontSize={fontSize}
          />
        </div>
      )}

      {/* content */}
      <div
        className="flex-1 overflow-y-auto app-scrollbar"
        style={{ padding: '11px 13px' }}
      >
        {children}
      </div>

      {/* footer */}
      {footer && (
        <div
          className="flex-shrink-0"
          style={{ borderTop: '0.5px solid var(--color-border)' }}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
