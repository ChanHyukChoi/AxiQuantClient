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
  {
    id: 'emps',
    label: '카드 사용자',
    path: '/emps',
    icon: <User size={18} strokeWidth={1.8} />,
  },
  {
    id: 'cards',
    label: '카드',
    path: '/cards',
    icon: <CreditCard size={18} strokeWidth={1.8} />,
  },
  {
    id: 'access',
    label: '접근권한',
    path: '/access',
    icon: <Lock size={18} strokeWidth={1.8} />,
  },
]

// ─── Menu List ────────────────────────────────────────────────────────────────

interface MenuListProps {
  isCollapsed: boolean
  currentPath: string
  onLinkClick?: () => void
}

const MenuList = ({ isCollapsed, currentPath, onLinkClick }: MenuListProps) => (
  <nav className="flex-1">
    <ul className="flex flex-col">
      {MENU_ITEMS.map((item) => {
        const isActive =
          currentPath === item.path || currentPath.startsWith(item.path + '/')

        return (
          <li key={item.id}>
            <Link
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              onClick={onLinkClick}
              className="flex items-center h-10 w-full transition-colors duration-100"
              style={{
                paddingLeft: 11,
                gap: 8,
                color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
                backgroundColor: isActive
                  ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)'
                  : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = 'var(--color-btn-hover)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isActive
                  ? 'color-mix(in srgb, var(--color-accent) 20%, transparent)'
                  : 'transparent'
              }}
            >
              {item.icon}
              <span
                className="text-sm font-medium whitespace-nowrap overflow-hidden"
                style={{
                  opacity: isCollapsed ? 0 : 1,
                  maxWidth: isCollapsed ? 0 : 120,
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
  const { isElectron, isCollapsed, isOpen } = useSidebarStore()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  const collapsed = isElectron ? isCollapsed : !isOpen

  return (
    <aside
      style={{
        width: collapsed ? '40px' : '160px',
        backgroundColor: 'var(--color-sidebar)',
        borderRight: '0.5px solid var(--color-border)',
        transition: 'width 200ms ease',
        flexShrink: 0,
        overflow: 'hidden',
      }}
      className="flex flex-col h-full select-none"
    >
      <MenuList isCollapsed={collapsed} currentPath={currentPath} />
    </aside>
  )
}
