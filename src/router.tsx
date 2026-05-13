import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { RootLayout } from '@/layouts/RootLayout'

// ─── Placeholder Pages ────────────────────────────────────────────────────────

const UsersPage = () => (
  <div className="p-6" style={{ color: 'var(--color-text)' }}>
    카드 사용자
  </div>
)

const CardsPage = () => (
  <div className="p-6" style={{ color: 'var(--color-text)' }}>
    카드
  </div>
)

const AccessPage = () => (
  <div className="p-6" style={{ color: 'var(--color-text)' }}>
    접근권한
  </div>
)

// ─── Routes ───────────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: RootLayout,
})

const usersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/users',
  component: UsersPage,
})

const cardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cards',
  component: CardsPage,
})

const accessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access',
  component: AccessPage,
})

const routeTree = rootRoute.addChildren([usersRoute, cardsRoute, accessRoute])

// ─── Router ───────────────────────────────────────────────────────────────────

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
