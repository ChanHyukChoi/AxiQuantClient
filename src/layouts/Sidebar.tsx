import { Link, useRouterState } from '@tanstack/react-router'
import { useSidebarStore } from '@/stores/sidebarStore'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
)

const CardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="6" y1="15" x2="10" y2="15" />
  </svg>
)

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

// ─── Menu Items ────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string
  label: string
  path: string
  icon: React.ReactNode
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'users',  label: '카드 사용자', path: '/users',  icon: <UserIcon /> },
  { id: 'cards',  label: '카드',       path: '/cards',  icon: <CardIcon /> },
  { id: 'access', label: '접근권한',   path: '/access', icon: <LockIcon /> },
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
        width: isCollapsed ? '56px' : '220px',
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
