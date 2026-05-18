import { TitleBar } from '@/layouts/TitleBar'
import { LogoSection } from '@/pages/LoginPage/LogoSection'
import { LoginForm } from '@/pages/LoginPage/LoginForm'

export const LoginPage = () => (
  <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
    <TitleBar />

    <main className="flex flex-1 items-center justify-center pt-10">
      <div
        className="w-full max-w-sm rounded-xl px-8 py-10 flex flex-col gap-6"
        style={{ backgroundColor: 'var(--color-sidebar)' }}
      >
        <LogoSection />
        <LoginForm />
      </div>
    </main>
  </div>
)
