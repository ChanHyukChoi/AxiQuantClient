import { z } from 'zod'

export const createEmpSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  name2: z.string().default(''),
  lastName: z.string().default(''),
  empNo: z.string().default(''),
  birth: z
    .union([
      z.literal(''),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'yyyy-MM-dd 형식이어야 합니다'),
    ])
    .default(''),
  dept: z.coerce.number().default(0),
  lv: z.coerce.number().default(0),
  tel: z.string().default(''),
  email: z.union([z.literal(''), z.string().email('올바른 이메일 형식이 아닙니다')]).default(''),
})

export type CreateEmpFormValues = z.output<typeof createEmpSchema>

export const updateEmpSchema = createEmpSchema

export type UpdateEmpFormValues = z.output<typeof updateEmpSchema>

export const updateEmpEmailSchema = z.union([
  z.literal(''),
  z.string().email('올바른 이메일 형식이 아닙니다'),
])
