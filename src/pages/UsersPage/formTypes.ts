import type { TFunction } from 'i18next'
import { z } from 'zod'
import { ALL_MENU_KEYS } from '@/pages/UsersPage/permissions'

const permissionEntrySchema = z.object({
  read: z.boolean(),
  write: z.boolean(),
})

export const createUserEditSchema = (t: TFunction<'user'>) =>
  z
    .object({
      name: z.string().min(1, t('validation.nameRequired')),
      loginId: z.string().min(1, t('validation.loginIdRequired')),
      active: z.boolean(),
      useExternalApi: z.boolean(),
      password: z.string().optional(),
      confirmPassword: z.string().optional(),
      permissions: z.record(z.string(), permissionEntrySchema),
    })
    .superRefine((data, ctx) => {
      const pw = data.password?.trim() ?? ''
      const cpw = data.confirmPassword?.trim() ?? ''
      if (pw || cpw) {
        if (pw.length < 4) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.passwordMin'),
            path: ['password'],
          })
        }
        if (pw !== cpw) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.passwordMismatch'),
            path: ['confirmPassword'],
          })
        }
      }
      for (const key of ALL_MENU_KEYS) {
        if (!data.permissions[key]) {
          ctx.addIssue({
            code: 'custom',
            message: t('validation.permissionsInvalid'),
            path: ['permissions'],
          })
          break
        }
      }
    })

export type UserEditFormValues = z.infer<ReturnType<typeof createUserEditSchema>>
