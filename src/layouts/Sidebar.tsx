import { Link, useRouterState } from '@tanstack/react-router'
import {
  Activity,
  Bell,
  Binary,
  ClipboardList,
  Cpu,
  CreditCard,
  Lock,
  MapPin,
  User,
  UserCog,
} from 'lucide-react'
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
    icon: <User size={28} strokeWidth={2} />,
  },
  {
    id: 'cards',
    label: '카드',
    path: '/cards',
    icon: <CreditCard size={28} strokeWidth={2} />,
  },
  {
    id: 'access',
    label: '접근권한',
    path: '/access',
    icon: <Lock size={28} strokeWidth={2} />,
  },
  {
    id: 'devices',
    label: '장치',
    path: '/devices',
    icon: <Cpu size={28} strokeWidth={2} />,
  },
  {
    id: 'area',
    label: '영역',
    path: '/area',
    icon: <MapPin size={28} strokeWidth={2} />,
  },
  {
    id: 'cardfmt',
    label: '카드 형식',
    path: '/cardfmt',
    icon: <Binary size={28} strokeWidth={2} />,
  },
  {
    id: 'monitor',
    label: '이벤트 모니터',
    path: '/monitor',
    icon: <Activity size={28} strokeWidth={2} />,
  },
  {
    id: 'alarm-settings',
    label: '경보 설정',
    path: '/alarm-settings',
    icon: <Bell size={28} strokeWidth={2} />,
  },
  {
    id: 'users',
    label: '사용자',
    path: '/users',
    icon: <UserCog size={28} strokeWidth={2} />,
  },
  {
    id: 'audit',
    label: '운영 기록',
    path: '/audit',
    icon: <ClipboardList size={28} strokeWidth={2} />,
  },
]

// ─── Menu List ────────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH_COLLAPSED = 58
const NAV_PADDING_LEFT = 14

interface MenuListProps {
  isCollapsed: boolean
  currentPath: string
  onLinkClick?: () => void
}

const navItemStyle = (active: boolean): React.CSSProperties => ({
  paddingLeft: NAV_PADDING_LEFT,
  gap: 12,
  color: active ? 'var(--color-accent)' : 'var(--color-text)',
  backgroundColor: active ? 'var(--color-accent-subtle)' : 'transparent',
  height: '50px',
})

const MenuList = ({ isCollapsed, currentPath, onLinkClick }: MenuListProps) => (
  <nav className="flex-1">
    <ul className="flex flex-col gap-0.5">
      {MENU_ITEMS.map((item) => {
        const isActive =
          currentPath === item.path || currentPath.startsWith(item.path + '/')

        return (
          <li key={item.id}>
            <Link
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              onClick={onLinkClick}
              className={`flex items-center h-10 w-full text-sm leading-snug transition-colors duration-100 ${
                isActive ? 'font-medium' : 'font-normal'
              }`}
              style={navItemStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-btn-hover)'
                }
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, navItemStyle(isActive))
              }}
            >
              <span className="shrink-0 flex items-center">{item.icon}</span>
              <span
                className="whitespace-nowrap overflow-hidden"
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
        width: collapsed ? `${SIDEBAR_WIDTH_COLLAPSED}px` : '240px',
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
