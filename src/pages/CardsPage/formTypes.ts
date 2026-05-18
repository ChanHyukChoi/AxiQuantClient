import { z } from 'zod'

export const createCardSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  cardNum: z.string().min(1, '카드 번호를 입력하세요'),
  empId: z.number().optional(),
  type: z.string().optional().default('직원'),
  status: z.string().optional().default('활성'),
})

export const updateCardSchema = createCardSchema

export type CreateCardFormValues = z.infer<typeof createCardSchema>
export type UpdateCardFormValues = z.infer<typeof updateCardSchema>
