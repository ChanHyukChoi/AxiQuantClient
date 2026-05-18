import { z } from 'zod'

export const cardFmtEditSchema = z.object({
  name: z.string().min(1, '형식명을 입력하세요'),
  facility: z.number(),
  idOffset: z.number(),
  funcId: z.number(),
  flags: z.number(),
  totalBits: z.number().min(1, '총 비트 수는 1 이상이어야 합니다'),
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

export type CardFmtEditFormValues = z.infer<typeof cardFmtEditSchema>
