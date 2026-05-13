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

// ─── Placeholder Pages ────────────────────────────────────────────────────────

const AccessPage = () => (
  <div className="p-6" style={{ color: 'var(--color-text)' }}>
    접근권한
  </div>
)

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  appRoute.addChildren([empsRoute, cardsRoute, accessRoute]),
])

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
