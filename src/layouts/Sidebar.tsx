import { Link, useRouterState } from '@tanstack/react-router'
import { CreditCard, Lock, User } from 'lucide-react'
import { useSidebarStore } from '@/stores/sidebarStore'

// ─── Menu Items ────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'users',  label: '카드 사용자', path: '/users',  icon: <User size={18} strokeWidth={1.8} /> },
  { id: 'cards',  label: '카드',       path: '/cards',  icon: <CreditCard size={18} strokeWidth={1.8} /> },
  { id: 'access', label: '접근권한',   path: '/access', icon: <Lock size={18} strokeWidth={1.8} /> },
]

// ─── Menu List ────────────────────────────────────────────────────────────────

interface MenuListProps {
  isCollapsed: boolean
  currentPath: string
  onLinkClick?: () => void
}

const MenuList = ({ isCollapsed, currentPath, onLinkClick }: MenuListProps) => (
  <nav className="flex-1 pt-1">
    <ul className="flex flex-col gap-0.5 px-2">
      {MENU_ITEMS.map((item) => {
        const isActive = currentPath === item.path || currentPath.startsWith(item.path + '/')

        return (
          <li key={item.id}>
            <Link
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              onClick={onLinkClick}
              className="flex items-center gap-3 rounded-md px-2.5 py-2 w-full transition-colors duration-100"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                backgroundColor: isActive
                  ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--color-btn-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive
                  ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)'
                  : 'transparent'
              }}
            >
              <span className="shrink-0">{item.icon}</span>
              <span
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                style={{
                  opacity: isCollapsed ? 0 : 1,
                  width: isCollapsed ? 0 : 'auto',
                  maxWidth: isCollapsed ? 0 : '160px',
                  transition: 'opacity 150ms ease, max-width 200ms ease',
                }}
              >
                {item.label}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  </nav>
)

// ─── Component ────────────────────────────────────────────────────────────────

export const Sidebar = () => {
  const { isElectron, isCollapsed, isOpen, toggle } = useSidebarStore()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // ── 웹 환경 ──────────────────────────────────────────────────────────────────
  if (!isElectron) {
    return (
      <>
        {/* Backdrop */}
        <div
          onClick={toggle}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            top: '40px',
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 40,
            opacity: isOpen ? 1 : 0,
            pointerEvents: isOpen ? 'auto' : 'none',
            transition: 'opacity 200ms ease',
          }}
        />

        {/* Sidebar Panel */}
        <aside
          style={{
            position: 'fixed',
            top: '40px',
            left: 0,
            bottom: 0,
            width: '220px',
            backgroundColor: 'var(--color-sidebar)',
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 200ms ease',
            zIndex: 50,
          }}
          className="flex flex-col overflow-hidden select-none"
        >
          <MenuList
            isCollapsed={false}
            currentPath={currentPath}
            onLinkClick={toggle}
          />
        </aside>
      </>
    )
  }

  // ── Electron 환경 ─────────────────────────────────────────────────────────────
  return (
    <aside
      style={{
        width: isCollapsed ? '50px' : '160px',
        backgroundColor: 'var(--color-sidebar)',
        transition: 'width 200ms ease',
        flexShrink: 0,
      }}
      className="flex flex-col h-full overflow-hidden select-none"
    >
      <MenuList
        isCollapsed={isCollapsed}
        currentPath={currentPath}
      />
    </aside>
  )
}
