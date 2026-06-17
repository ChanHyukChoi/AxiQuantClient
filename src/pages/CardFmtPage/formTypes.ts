import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createCardFmtEditSchema = (t: TFunction<'cardFmt'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    facility: z.number(),
    idOffset: z.number(),
    funcId: z.number(),
    flags: z.number(),
    totalBits: z.number().min(1, t('validation.totalBitsMin')),
    evenBits: z.number(),
    evenLoc: z.number(),
    oddBits: z.number(),
    oddLoc: z.number(),
    fcBits: z.number(),
    fcLoc: z.number(),
    cardBits: z.number(),
    cardLoc: z.number(),
    issueBits: z.number(),
    issueLoc: z.number(),
    minDigits: z.number(),
    maxDigits: z.number(),
    ext: z.string(),
  })

export type CardFmtEditFormValues = z.infer<ReturnType<typeof createCardFmtEditSchema>>
