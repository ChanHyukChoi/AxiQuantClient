import { z } from 'zod'
import { ALL_MENU_KEYS } from '@/pages/UsersPage/permissions'

const permissionEntrySchema = z.object({
  read: z.boolean(),
  write: z.boolean(),
})

export const userEditSchema = z
  .object({
    name: z.string().min(1, '명칭을 입력하세요'),
    loginId: z.string().min(1, '로그인 ID를 입력하세요'),
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
        ctx.addIssue({ code: 'custom', message: '비밀번호는 4자 이상이어야 합니다.', path: ['password'] })
      }
      if (pw !== cpw) {
        ctx.addIssue({ code: 'custom', message: '비밀번호가 일치하지 않습니다.', path: ['confirmPassword'] })
      }
    }
    for (const key of ALL_MENU_KEYS) {
      if (!data.permissions[key]) {
        ctx.addIssue({
          code: 'custom',
          message: '권한 정보가 올바르지 않습니다.',
          path: ['permissions'],
        })
        break
      }
    }
  })

export type UserEditFormValues = z.infer<typeof userEditSchema>
