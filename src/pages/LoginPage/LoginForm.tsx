import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '@/api/auth'
import { axiosInstance } from '@/lib/infra/axios'
import { sseClient } from '@/lib/infra/sse'
import { useAuthStore } from '@/stores/authStore'
import { router } from '@/router'
import { loginSchema, type LoginFormValues } from '@/pages/LoginPage/formTypes'
import {
  LoginField,
  loginInputBlur,
  loginInputFocus,
  loginInputStyle,
} from '@/pages/LoginPage/LoginField'

export const LoginForm = () => {
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
    const isElectron = navigator.userAgent.includes('Electron')
    axiosInstance.defaults.baseURL = isElectron ? values.serverUrl : ''

    const result = await login(values.username, values.password)

    if (!result) {
      setErrorMessage('서버 연결 또는 인증에 실패했습니다.')
      return
    }

    setToken(result.token)
    sseClient.connect()
    router.navigate({ to: '/emps' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <LoginField label="서버 주소" error={errors.serverUrl?.message}>
        <input
          {...register('serverUrl')}
          type="url"
          className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
          style={loginInputStyle}
          onFocus={loginInputFocus}
          onBlur={loginInputBlur}
        />
      </LoginField>

      <LoginField label="아이디" error={errors.username?.message}>
        <input
          {...register('username')}
          type="text"
          autoComplete="username"
          className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
          style={loginInputStyle}
          onFocus={loginInputFocus}
          onBlur={loginInputBlur}
        />
      </LoginField>

      <LoginField label="비밀번호" error={errors.password?.message}>
        <input
          {...register('password')}
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
          style={loginInputStyle}
          onFocus={loginInputFocus}
          onBlur={loginInputBlur}
        />
      </LoginField>

      {errorMessage ? (
        <p className="text-xs text-center" style={{ color: '#f87171' }}>
          {errorMessage}
        </p>
      ) : null}

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
  )
}
