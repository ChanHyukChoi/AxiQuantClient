import { Tab } from './Tab'
import type { TabItem } from './Tab'

interface DrawerProps {
  width?: number
  header: React.ReactNode
  tabs?: TabItem[]
  activeTab?: string
  onTabChange?: (key: string) => void
  actions?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

export const Drawer = ({
  width = 268,
  header,
  tabs,
  activeTab = '',
  onTabChange,
  actions,
  footer,
  children,
}: DrawerProps) => {
  return (
    <>
      <style>{`
        .drawer-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .drawer-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .drawer-scroll::-webkit-scrollbar-thumb {
          background: #2e3139;
          border-radius: 2px;
        }
      `}</style>
      <div
        className="flex flex-col flex-shrink-0 overflow-hidden"
        style={{
          width,
          background: 'var(--color-sidebar)',
          borderLeft: '0.5px solid #2a2d32',
        }}
      >
        {/* header */}
        <div className="flex-shrink-0 p-3 pb-0">
          {header}
        </div>

        {/* actions */}
        {actions && (
          <div className="flex-shrink-0 flex items-center justify-end gap-1.5 px-3 mb-2 mt-2">
            {actions}
          </div>
        )}

        {/* tabs */}
        {tabs && tabs.length > 0 && onTabChange && (
          <div className="flex-shrink-0">
            <Tab items={tabs} activeKey={activeTab} onChange={onTabChange} />
          </div>
        )}

        {/* content */}
        <div
          className="flex-1 overflow-y-auto drawer-scroll"
          style={{ padding: '11px 13px' }}
        >
          {children}
        </div>

        {/* footer */}
        {footer && (
          <div
            className="flex-shrink-0"
            style={{ borderTop: '0.5px solid #2a2d32' }}
          >
            {footer}
          </div>
        )}
      </div>
    </>
  )
}
