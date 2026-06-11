import { useEffect } from 'react'

export const LIST_OPTIONS_FONT_SIZE = 15
export const LIST_OPTIONS_MODAL_WIDTH = 360
export const LIST_OPTIONS_CONTENT_HEIGHT = 300

export const ListOptionsFilterField = ({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) => (
  <div className="flex flex-col gap-1">
    <span style={{ color: 'var(--color-text-muted)', fontSize: LIST_OPTIONS_FONT_SIZE }}>
      {label}
    </span>
    {children}
  </div>
)

export interface ListOptionsTab {
  id: string
  label: string
}

interface ListOptionsModalShellProps {
  open: boolean
  title?: string
  tabs: ListOptionsTab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  onClose: () => void
  contentHeight?: number
  children: React.ReactNode
  footer: React.ReactNode
}

const tabBtnClass = (active: boolean) =>
  ['flex-1 py-1.5 rounded border', active ? 'font-medium' : ''].join(' ')

export const ListOptionsModalShell = ({
  open,
  title = '목록 옵션',
  tabs,
  activeTab,
  onTabChange,
  onClose,
  contentHeight = LIST_OPTIONS_CONTENT_HEIGHT,
  children,
  footer,
}: ListOptionsModalShellProps) => {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="rounded-md p-5 shrink-0"
        style={{
          width: LIST_OPTIONS_MODAL_WIDTH,
          background: 'var(--color-sidebar)',
          border: '0.5px solid var(--color-border)',
        }}
      >
        <p
          className="font-medium mb-3"
          style={{ color: 'var(--color-text)', fontSize: LIST_OPTIONS_FONT_SIZE }}
        >
          {title}
        </p>

        <div className="flex gap-1.5 mb-3">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab
            return (
              <button
                key={tab.id}
                type="button"
                className={tabBtnClass(isActive)}
                style={{
                  background: isActive ? 'var(--color-btn-hover)' : 'transparent',
                  borderColor: 'var(--color-border)',
                  color: isActive ? 'var(--color-text)' : 'var(--color-text-muted)',
                  fontSize: LIST_OPTIONS_FONT_SIZE,
                }}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col" style={{ height: contentHeight }}>
          {children}
        </div>

        <div className="flex justify-end gap-2 mt-5 flex-wrap">{footer}</div>
      </div>
    </div>
  )
}
