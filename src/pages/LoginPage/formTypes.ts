import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createLoginSchema = (t: TFunction<'auth'>) =>
  z.object({
    serverUrl: z.string().url(t('validation.serverUrl')),
    username: z.string().min(1, t('validation.username')),
    password: z.string().min(1, t('validation.password')),
  })

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
