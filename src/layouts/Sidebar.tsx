import { Link, useRouterState } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
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

interface MenuItemDef {
  id: string
  path: string
  icon: React.ReactNode
}

interface MenuGroupDef {
  id: string
  items: MenuItemDef[]
}

/** WPF 트리 그룹 순서 — 평면 목록 + 구분선 (트리 UI 없음) */
const MENU_GROUPS: MenuGroupDef[] = [
  {
    id: 'access-mgmt',
    items: [
      { id: 'emps', path: '/emps', icon: <User size={28} strokeWidth={2} /> },
      { id: 'cards', path: '/cards', icon: <CreditCard size={28} strokeWidth={2} /> },
      { id: 'access', path: '/access', icon: <Lock size={28} strokeWidth={2} /> },
      { id: 'area', path: '/area', icon: <MapPin size={28} strokeWidth={2} /> },
      { id: 'cardfmt', path: '/cardfmt', icon: <Binary size={28} strokeWidth={2} /> },
    ],
  },
  {
    id: 'control-monitor',
    items: [
      { id: 'monitor', path: '/monitor', icon: <Activity size={28} strokeWidth={2} /> },
    ],
  },
  {
    id: 'alarm-mgmt',
    items: [
      { id: 'alarm-settings', path: '/alarm-settings', icon: <Bell size={28} strokeWidth={2} /> },
    ],
  },
  {
    id: 'security-equipment',
    items: [
      { id: 'controllers', path: '/controllers', icon: <Cpu size={28} strokeWidth={2} /> },
      { id: 'readers', path: '/readers', icon: <ScanLine size={28} strokeWidth={2} /> },
      { id: 'inputs', path: '/inputs', icon: <ArrowRightToLine size={28} strokeWidth={2} /> },
      { id: 'outputs', path: '/outputs', icon: <ArrowLeftFromLine size={28} strokeWidth={2} /> },
    ],
  },
  {
    id: 'schedule',
    items: [
      { id: 'schedule', path: '/schedule', icon: <CalendarClock size={28} strokeWidth={2} /> },
    ],
  },
  {
    id: 'linkage',
    items: [
      { id: 'linkage', path: '/linkage', icon: <Link2 size={28} strokeWidth={2} /> },
    ],
  },
  {
    id: 'system-mgmt',
    items: [
      { id: 'audit', path: '/audit', icon: <ClipboardList size={28} strokeWidth={2} /> },
      { id: 'users', path: '/users', icon: <UserCog size={28} strokeWidth={2} /> },
    ],
  },
]

const SIDEBAR_WIDTH_COLLAPSED = 58
const NAV_PADDING_LEFT = 14

interface MenuItem extends MenuItemDef {
  label: string
}

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

const MenuDivider = ({ isCollapsed }: { isCollapsed: boolean }) => (
  <li aria-hidden className="list-none" role="separator">
    <div
      style={{
        margin: isCollapsed ? '6px 10px' : '6px 14px',
        borderTop: '0.5px solid var(--color-border)',
      }}
    />
  </li>
)

const MenuLink = ({
  item,
  isCollapsed,
  isActive,
  onLinkClick,
}: {
  item: MenuItem
  isCollapsed: boolean
  isActive: boolean
  onLinkClick?: () => void
}) => (
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

const MenuList = ({ isCollapsed, currentPath, onLinkClick }: MenuListProps) => {
  const { t } = useTranslation('nav')

  const groups = useMemo(
    () =>
      MENU_GROUPS.map((group) => ({
        ...group,
        items: group.items.map((item) => ({
          ...item,
          label: t(`menu.${item.id}`),
        })),
      })),
    [t],
  )

  return (
    <nav className="flex-1 overflow-y-auto app-scrollbar">
      <ul className="flex flex-col">
        {groups.map((group, groupIndex) => (
          <li key={group.id} className="list-none">
            <ul className="flex flex-col">
              {groupIndex > 0 ? <MenuDivider isCollapsed={isCollapsed} /> : null}
              {group.items.map((item) => {
                const isActive =
                  currentPath === item.path || currentPath.startsWith(`${item.path}/`)

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
}

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
