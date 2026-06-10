import { z } from 'zod'

export const CARD_STATUS_VALUES = ['활성', '발급', '분실', '반납'] as const
export type CardStatusValue = (typeof CARD_STATUS_VALUES)[number]

export const CARD_STATUS_OPTIONS = CARD_STATUS_VALUES.map((value) => ({ value, label: value }))

const cardStatusSchema = z.enum(CARD_STATUS_VALUES)

export const createCardSchema = z
  .object({
    name: z.string().min(1, '명칭을 입력하세요'),
    cardNum: z.string().min(1, '카드 번호를 입력하세요'),
    empId: z.number().optional(),
    type: z.string().optional().default('직원'),
    status: cardStatusSchema.default('활성'),
    changePin: z.boolean().default(false),
    pin: z.string().default(''),
    pinConfirm: z.string().default(''),
    issuedAt: z.string().default(''),
    expiredAt: z.string().default(''),
  })
  .superRefine((data, ctx) => {
    if (data.status === '활성' && (data.empId == null || data.empId <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '활성 상태에서는 카드 사용자를 선택해야 합니다.',
        path: ['empId'],
      })
    }
    if (!data.changePin) return
    if (!/^\d{4}$/.test(data.pin)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PIN은 4자리 숫자여야 합니다.',
        path: ['pin'],
      })
    }
    if (data.pin !== data.pinConfirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'PIN 확인이 일치하지 않습니다.',
        path: ['pinConfirm'],
      })
    }
  })

export const updateCardSchema = createCardSchema

export type CreateCardFormValues = z.infer<typeof createCardSchema>
export type UpdateCardFormValues = z.infer<typeof updateCardSchema>
