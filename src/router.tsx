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
import { AccessPageB } from '@/pages/AccessPageB'
import { ControllersPage } from '@/pages/ControllersPage'
import { ControllersPageB } from '@/pages/ControllersPageB'
import { InputsPage } from '@/pages/InputsPage'
import { InputsPageB } from '@/pages/InputsPageB'
import { OutputsPage } from '@/pages/OutputsPage'
import { OutputsPageB } from '@/pages/OutputsPageB'
import { ReadersPage } from '@/pages/ReadersPage'
import { ReadersPageB } from '@/pages/ReadersPageB'
import { AreaPage } from '@/pages/AreaPage'
import { AreaPageB } from '@/pages/AreaPageB'
import { CardFmtPage } from '@/pages/CardFmtPage'
import { CardFmtPageB } from '@/pages/CardFmtPageB'
import { EventMonitorPage } from '@/pages/EventMonitorPage'
import { UsersPage } from '@/pages/UsersPage'
import { UsersPageB } from '@/pages/UsersPageB'
import { AuditLogPage } from '@/pages/AuditLogPage'
import { AlarmSettingsPage } from '@/pages/AlarmSettingsPage'
import { AlarmSettingsPageB } from '@/pages/AlarmSettingsPageB'
import { TimezoneHolidayPage } from '@/pages/TimezoneHolidayPage'
import { TimezoneHolidayPageB } from '@/pages/TimezoneHolidayPageB'

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

const accessBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/access-b',
  component: AccessPageB,
})

const controllersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/controllers',
  component: ControllersPage,
})

const controllersBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/controllers-b',
  component: ControllersPageB,
})

const readersRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/readers',
  component: ReadersPage,
})

const readersBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/readers-b',
  component: ReadersPageB,
})

const inputsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/inputs',
  component: InputsPage,
})

const inputsBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/inputs-b',
  component: InputsPageB,
})

const outputsRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/outputs',
  component: OutputsPage,
})

const outputsBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/outputs-b',
  component: OutputsPageB,
})

const areaRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/area',
  component: AreaPage,
})

const areaBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/area-b',
  component: AreaPageB,
})

const cardfmtRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cardfmt',
  component: CardFmtPage,
})

const cardfmtBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/cardfmt-b',
  component: CardFmtPageB,
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

const usersBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/users-b',
  component: UsersPageB,
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

const alarmSettingsBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/alarm-settings-b',
  component: AlarmSettingsPageB,
})

const timezoneHolidayRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/timezone-holiday',
  component: TimezoneHolidayPage,
})

const timezoneHolidayBRoute = createRoute({
  getParentRoute: () => appRoute,
  path: '/timezone-holiday-b',
  component: TimezoneHolidayPageB,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  appRoute.addChildren([
    empsRoute,
    cardsRoute,
    accessRoute,
    accessBRoute,
    controllersRoute,
    controllersBRoute,
    readersRoute,
    readersBRoute,
    inputsRoute,
    inputsBRoute,
    outputsRoute,
    outputsBRoute,
    areaRoute,
    areaBRoute,
    cardfmtRoute,
    cardfmtBRoute,
    monitorRoute,
    usersRoute,
    usersBRoute,
    auditRoute,
    alarmSettingsRoute,
    alarmSettingsBRoute,
    timezoneHolidayRoute,
    timezoneHolidayBRoute,
  ]),
])

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
