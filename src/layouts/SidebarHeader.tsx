import { PanelLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSidebarStore } from '@/stores/sidebarStore'

interface SidebarHeaderProps {
  isCollapsed: boolean
}

export const SidebarHeader = ({ isCollapsed }: SidebarHeaderProps) => {
  const { toggle } = useSidebarStore()
  const { t } = useTranslation('layout')

  const toggleButton = (
    <button
      type="button"
      onClick={toggle}
      title={isCollapsed ? t('sidebar.expand') : t('sidebar.collapse')}
      className="flex items-center justify-center rounded transition-colors duration-100 shrink-0"
      style={{
        width: 28,
        height: 28,
        background: 'transparent',
        color: 'var(--color-icon)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--color-btn-hover)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <PanelLeft size={16} strokeWidth={1.75} />
    </button>
  )

  if (isCollapsed) {
    return (
      <div className="flex items-center justify-center shrink-0" style={{ height: 44 }}>
        {toggleButton}
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-between gap-2 shrink-0"
      style={{
        height: 44,
        paddingLeft: 14,
        paddingRight: 8,
      }}
    >
      <span
        className="font-semibold truncate"
        style={{ fontSize: 24, color: 'var(--color-text)' }}
      >
        AxiQuant
      </span>
      {toggleButton}
    </div>
  )
}
