import { z } from 'zod'

export const accLvSchema = z.object({
  name: z.string().min(1, '권한명을 입력하세요'),
})

export type AccLvFormValues = z.infer<typeof accLvSchema>
