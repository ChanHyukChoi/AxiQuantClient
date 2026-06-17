import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { axiosInstance } from '@/lib/infra/axios'
import { isElectronRuntime } from '@/lib/app/isElectronRuntime'
import { sseClient } from '@/lib/infra/sse'
import { useAuthStore } from '@/stores/authStore'
import { router } from '@/router'
import { useLogin } from '@/hooks/api/useAuth'
import { createLoginSchema, type LoginFormValues } from '@/pages/LoginPage/formTypes'
import {
  LoginField,
  loginInputBlur,
  loginInputFocus,
  loginInputStyle,
} from '@/pages/LoginPage/LoginField'

export const LoginForm = () => {
  const { t } = useTranslation('auth')
  const { setAuth } = useAuthStore()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const loginMutation = useLogin()

  const loginSchema = useMemo(() => createLoginSchema(t), [t])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting: formSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      serverUrl: 'http://192.168.250.201:5001',
      username: 'admin',
      password: 'admin1234',
    },
  })

  const isSubmitting = formSubmitting || loginMutation.isPending

  const onSubmit = async (values: LoginFormValues) => {
    setErrorMessage(null)
    const isElectron = isElectronRuntime()
    const serverUrl = values.serverUrl.trim()

    if (isElectron && !serverUrl) {
      setErrorMessage(t('errorServerRequired'))
      return
    }

    axiosInstance.defaults.baseURL = isElectron ? serverUrl : ''

    const result = await loginMutation.mutateAsync({
      username: values.username,
      password: values.password,
    })

    if (!result) {
      setErrorMessage(t('errorAuthFailed'))
      return
    }

    setAuth(result.token, values.username)
    sseClient.connect()
    router.navigate({ to: '/emps' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <LoginField label={t('serverUrl')} error={errors.serverUrl?.message}>
        <input
          {...register('serverUrl')}
          type="url"
          className="w-full rounded-md px-3 py-2 text-sm outline-none transition-colors"
          style={loginInputStyle}
          onFocus={loginInputFocus}
          onBlur={loginInputBlur}
        />
      </LoginField>

      <LoginField label={t('username')} error={errors.username?.message}>
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

      <LoginField label={t('password')} error={errors.password?.message}>
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
        {isSubmitting ? t('loggingIn') : t('login')}
      </button>
    </form>
  )
}
