import { Link, useRouterState } from '@tanstack/react-router'
import {
  Activity,
  ArrowLeftFromLine,
  ArrowRightToLine,
  Bell,
  Binary,
  CalendarClock,
  ClipboardList,
  Cpu,
  Link2,
  CreditCard,
  Lock,
  MapPin,
  ScanLine,
  User,
  UserCog,
} from 'lucide-react'
import { SidebarHeader } from '@/layouts/SidebarHeader'
import { useSidebarStore } from '@/stores/sidebarStore'

// ─── Menu Items ────────────────────────────────────────────────────────────────

interface MenuItem {
  id: string
  label: string
  path: string
  /** B안 등 동일 메뉴로 묶을 추가 경로 */
  activePaths?: string[]
  icon: React.ReactNode
}

interface MenuGroup {
  id: string
  items: MenuItem[]
}

/** WPF 트리 그룹 순서 — 평면 목록 + 구분선 (트리 UI 없음) */
const MENU_GROUPS: MenuGroup[] = [
  {
    id: 'access-mgmt',
    items: [
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
        label: '접근 권한',
        path: '/access',
        activePaths: ['/access', '/access-b'],
        icon: <Lock size={28} strokeWidth={2} />,
      },
      {
        id: 'area',
        label: '영역',
        path: '/area',
        activePaths: ['/area', '/area-b'],
        icon: <MapPin size={28} strokeWidth={2} />,
      },
      {
        id: 'cardfmt',
        label: '카드 형식',
        path: '/cardfmt',
        activePaths: ['/cardfmt', '/cardfmt-b'],
        icon: <Binary size={28} strokeWidth={2} />,
      },
    ],
  },
  {
    id: 'control-monitor',
    items: [
      {
        id: 'monitor',
        label: '이벤트 모니터',
        path: '/monitor',
        activePaths: ['/monitor', '/monitor-b'],
        icon: <Activity size={28} strokeWidth={2} />,
      },
    ],
  },
  {
    id: 'alarm-mgmt',
    items: [
      {
        id: 'alarm-settings',
        label: '경보 설정',
        path: '/alarm-settings',
        activePaths: ['/alarm-settings', '/alarm-settings-b'],
        icon: <Bell size={28} strokeWidth={2} />,
      },
    ],
  },
  {
    id: 'security-equipment',
    items: [
      {
        id: 'controllers',
        label: '제어기',
        path: '/controllers',
        activePaths: ['/controllers', '/controllers-b'],
        icon: <Cpu size={28} strokeWidth={2} />,
      },
      {
        id: 'readers',
        label: '리더',
        path: '/readers',
        activePaths: ['/readers', '/readers-b'],
        icon: <ScanLine size={28} strokeWidth={2} />,
      },
      {
        id: 'inputs',
        label: '입력',
        path: '/inputs',
        activePaths: ['/inputs', '/inputs-b'],
        icon: <ArrowRightToLine size={28} strokeWidth={2} />,
      },
      {
        id: 'outputs',
        label: '출력',
        path: '/outputs',
        activePaths: ['/outputs', '/outputs-b'],
        icon: <ArrowLeftFromLine size={28} strokeWidth={2} />,
      },
    ],
  },
  {
    id: 'schedule',
    items: [
      {
        id: 'timezone-holiday',
        label: '타임존·휴일',
        path: '/timezone-holiday',
        activePaths: ['/timezone-holiday', '/timezone-holiday-b'],
        icon: <CalendarClock size={28} strokeWidth={2} />,
      },
    ],
  },
  {
    id: 'linkage',
    items: [
      {
        id: 'linkage',
        label: '연동',
        path: '/linkage',
        activePaths: ['/linkage', '/linkage-b'],
        icon: <Link2 size={28} strokeWidth={2} />,
      },
    ],
  },
  {
    id: 'system-mgmt',
    items: [
      {
        id: 'audit',
        label: '운영 기록',
        path: '/audit',
        icon: <ClipboardList size={28} strokeWidth={2} />,
      },
      {
        id: 'users',
        label: '사용자',
        path: '/users',
        activePaths: ['/users', '/users-b'],
        icon: <UserCog size={28} strokeWidth={2} />,
      },
    ],
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
  fontSize: 16,
  gap: 12,
  color: active ? 'var(--color-accent)' : 'var(--color-text)',
  backgroundColor: active ? 'var(--color-accent-subtle)' : 'transparent',
  height: '50px',
})

interface MenuDividerProps {
  isCollapsed: boolean
}

const MenuDivider = ({ isCollapsed }: MenuDividerProps) => (
  <li aria-hidden className="list-none" role="separator">
    <div
      style={{
        margin: isCollapsed ? '6px 10px' : '6px 14px',
        borderTop: '0.5px solid var(--color-border)',
      }}
    />
  </li>
)

interface MenuLinkProps {
  item: MenuItem
  isCollapsed: boolean
  isActive: boolean
  onLinkClick?: () => void
}

const MenuLink = ({ item, isCollapsed, isActive, onLinkClick }: MenuLinkProps) => (
  <Link
    to={item.path}
    title={isCollapsed ? item.label : undefined}
    onClick={onLinkClick}
    className={`flex items-center h-10 w-full leading-snug transition-colors duration-100 ${
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
)

const MenuList = ({ isCollapsed, currentPath, onLinkClick }: MenuListProps) => (
  <nav className="flex-1 overflow-y-auto app-scrollbar">
    <ul className="flex flex-col">
      {MENU_GROUPS.map((group, groupIndex) => (
        <li key={group.id} className="list-none">
          <ul className="flex flex-col">
            {groupIndex > 0 ? <MenuDivider isCollapsed={isCollapsed} /> : null}
            {group.items.map((item) => {
              const matchPaths = item.activePaths ?? [item.path]
              const isActive = matchPaths.some(
                (p) => currentPath === p || currentPath.startsWith(`${p}/`),
              )

              return (
                <li key={item.id}>
                  <MenuLink
                    item={item}
                    isCollapsed={isCollapsed}
                    isActive={isActive}
                    onLinkClick={onLinkClick}
                  />
                </li>
              )
            })}
          </ul>
        </li>
      ))}
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
      <SidebarHeader isCollapsed={collapsed} />
      <MenuList isCollapsed={collapsed} currentPath={currentPath} />
    </aside>
  )
}
