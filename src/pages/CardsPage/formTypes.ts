import type { TFunction } from 'i18next'
import { z } from 'zod'

export const CARD_TYPE_VALUES = ['직원', '방문', '발급'] as const
export type CardTypeValue = (typeof CARD_TYPE_VALUES)[number]
export const CARD_TYPE_DEFAULT: CardTypeValue = '직원'

export const CARD_STATUS_VALUES = ['활성', '발급', '분실', '반납'] as const
export type CardStatusValue = (typeof CARD_STATUS_VALUES)[number]
export const CARD_STATUS_ACTIVE: CardStatusValue = '활성'

export const createCardSchema = (t: TFunction<'card'>) => {
  const cardStatusSchema = z.enum(CARD_STATUS_VALUES)

  return z
    .object({
      name: z.string().min(1, t('validation.nameRequired')),
      cardNum: z.string().min(1, t('validation.cardNumRequired')),
      empId: z.number().optional(),
      type: z.string().optional().default(CARD_TYPE_DEFAULT),
      status: cardStatusSchema.default(CARD_STATUS_ACTIVE),
      changePin: z.boolean().default(false),
      pin: z.string().default(''),
      pinConfirm: z.string().default(''),
      issuedAt: z.string().default(''),
      expiredAt: z.string().default(''),
    })
    .superRefine((data, ctx) => {
      if (data.status === CARD_STATUS_ACTIVE && (data.empId == null || data.empId <= 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.empRequiredWhenActive'),
          path: ['empId'],
        })
      }
      if (!data.changePin) return
      if (!/^\d{4}$/.test(data.pin)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.pinFormat'),
          path: ['pin'],
        })
      }
      if (data.pin !== data.pinConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t('validation.pinMismatch'),
          path: ['pinConfirm'],
        })
      }
    })
}

export type CreateCardFormValues = z.infer<ReturnType<typeof createCardSchema>>
export type UpdateCardFormValues = CreateCardFormValues
