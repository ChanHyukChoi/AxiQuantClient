import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { login } from '@/api/auth'
import { axiosInstance } from '@/lib/axios'
import { sseClient } from '@/lib/sse'
import { useAuthStore } from '@/stores/authStore'
import { TitleBar } from '@/layouts/TitleBar'
import { router } from '@/router'

// ─── Schema ──────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  serverUrl: z.string().url('올바른 URL 형식이어야 합니다.'),
  username: z.string().min(1, '아이디를 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── Component ───────────────────────────────────────────────────────────────

export const LoginPage = () => {
  const { setToken } = useAuthStore()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      serverUrl: 'http://192.168.250.201:5001',
      username: 'admin',
      password: 'admin1234',
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null)
    axiosInstance.defaults.baseURL = values.serverUrl

    const result = await login(values.username, values.password)

    if (!result) {
      setErrorMessage('서버 연결 또는 인증에 실패했습니다.')
      return
    }

    setToken(result.token)
    sseClient.connect()
    router.navigate({ to: '/users' })
  }

  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <TitleBar />

      <main className="flex flex-1 items-center justify-center pt-10">
        <div
          className="w-full max-w-sm rounded-xl px-8 py-10 flex flex-col gap-6"
          style={{ backgroundColor: 'var(--color-sidebar)' }}
        >
          {/* 로고 */}
          <LogoSection />

          {/* 폼 */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
            noValidate
          >
            {/* 서버 주소 */}
            <Field label="서버 주소" error={errors.serverUrl?.message}>
              <input
                {...register('serverUrl')}
                type="url"
                className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            {/* 아이디 */}
            <Field label="아이디" error={errors.username?.message}>
              <input
                {...register('username')}
                type="text"
                autoComplete="username"
                className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            {/* 비밀번호 */}
            <Field label="비밀번호" error={errors.password?.message}>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
                style={inputStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </Field>

            {/* 에러 메시지 */}
            {errorMessage && (
              <p className="text-xs text-center" style={{ color: '#f87171' }}>
                {errorMessage}
              </p>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md py-2 text-sm font-semibold transition-opacity mt-1"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: '#ffffff',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────

const LogoSection = () => {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="flex flex-col items-center gap-1 mb-2">
      {!imgError ? (
        <img
          src="/src/assets/logo.png"
          alt="AxiQuant"
          className="h-12 object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-2xl font-bold" style={{ color: 'var(--color-accent)' }}>
          AxiQuant
        </span>
      )}
      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
        출입 관제 시스템
      </span>
    </div>
  )
}

// ─── Field ────────────────────────────────────────────────────────────────────

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

const Field = ({ label, error, children }: FieldProps) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
      {label}
    </label>
    {children}
    {error && (
      <span className="text-xs" style={{ color: '#f87171' }}>
        {error}
      </span>
    )}
  </div>
)

// ─── Input Style Helpers ──────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-bg)',
  color: 'var(--color-text)',
  border: '1px solid var(--color-text-muted)',
}

const focusStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'var(--color-accent)'
}

const blurStyle = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.style.borderColor = 'var(--color-text-muted)'
}
