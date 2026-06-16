import {
  Outlet,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { RootLayout } from '@/layouts/RootLayout'
import { LoginPage } from '@/pages/LoginPage'
import { EmpsPage } from '@/pages/EmpsPage'
import { CardsPage } from '@/pages/CardsPage'
import { AccessPage } from '@/pages/AccessPage'
import { ControllersPage } from '@/pages/ControllersPage'
import { InputsPage } from '@/pages/InputsPage'
import { OutputsPage } from '@/pages/OutputsPage'
import { ReadersPage } from '@/pages/ReadersPage'
import { AreaPage } from '@/pages/AreaPage'
import { CardFmtPage } from '@/pages/CardFmtPage'
import { EventMonitorPage } from '@/pages/EventMonitorPage'
import { UsersPage } from '@/pages/UsersPage'
import { AuditLogPage } from '@/pages/AuditLogPage'
import { AlarmSettingsPage } from '@/pages/AlarmSettingsPage'
import { SchedulePage } from '@/pages/SchedulePage'
import { LinkagePage } from '@/pages/LinkagePage'

// ─── Routes ───────────────────────────────────────────────────────────────────

// Root: 레이아웃 없이 Outlet만 렌더
const rootRoute = createRootRoute({
  component: () => <Outlet />,
})

// /: /login으로 리다이렉트
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/login' })
  },
})

// /login: LoginPage 직접 렌더 (TitleBar 포함, Sidebar 없음)
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

// 인증 영역 레이아웃 라우트 (TitleBar + Sidebar)
const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: '_app',
  component: RootLayout,
})

const empsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/emps',
  component: EmpsPage,
})

const cardsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cards',
  component: CardsPage,
})

const accessRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/access',
  component: AccessPage,
})

const controllersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/controllers',
  component: ControllersPage,
})

const readersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/readers',
  component: ReadersPage,
})

const inputsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/inputs',
  component: InputsPage,
})

const outputsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/outputs',
  component: OutputsPage,
})

const areaRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/area',
  component: AreaPage,
})

const cardfmtRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cardfmt',
  component: CardFmtPage,
})

const monitorRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/monitor',
  component: EventMonitorPage,
})

const usersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/users',
  component: UsersPage,
})

const auditRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/audit',
  component: AuditLogPage,
})

const alarmSettingsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/alarm-settings',
  component: AlarmSettingsPage,
})

const scheduleRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/schedule',
  component: SchedulePage,
})

const linkageRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/linkage',
  component: LinkagePage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  appRoute.addChildren([
    empsRoute,
    cardsRoute,
    accessRoute,
    controllersRoute,
    readersRoute,
    inputsRoute,
    outputsRoute,
    areaRoute,
    cardfmtRoute,
    monitorRoute,
    usersRoute,
    auditRoute,
    alarmSettingsRoute,
    scheduleRoute,
    linkageRoute,
  ]),
])

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
