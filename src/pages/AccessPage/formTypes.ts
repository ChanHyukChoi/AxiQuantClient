import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createAccLvSchema = (t: TFunction<'access'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
  })

export type AccLvFormValues = z.infer<ReturnType<typeof createAccLvSchema>>
