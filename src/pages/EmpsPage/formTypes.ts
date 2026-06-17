import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createEmpSchema = (t: TFunction<'emp'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    name2: z.string().default(''),
    lastName: z.string().default(''),
    empNo: z.string().default(''),
    birth: z
      .union([
        z.literal(''),
        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, t('validation.birthFormat')),
      ])
      .default(''),
    dept: z.coerce.number().default(0),
    lv: z.coerce.number().default(0),
    tel: z.string().default(''),
    email: z
      .union([z.literal(''), z.string().email(t('validation.emailInvalid'))])
      .default(''),
  })

export type CreateEmpFormValues = z.output<ReturnType<typeof createEmpSchema>>

export type UpdateEmpFormValues = CreateEmpFormValues

export const createEmpEmailSchema = (t: TFunction<'emp'>) =>
  z.union([z.literal(''), z.string().email(t('validation.emailInvalid'))])
