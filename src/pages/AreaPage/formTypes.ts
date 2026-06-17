import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createAreaEditSchema = (t: TFunction<'area'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    active: z.number(),
    occmax: z.number().min(0, t('validation.occmaxMin')),
    multiocc: z.number(),
  })

export type AreaEditFormValues = z.infer<ReturnType<typeof createAreaEditSchema>>
