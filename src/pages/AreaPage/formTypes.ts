import { z } from 'zod'

export const areaEditSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  active: z.number(),
  occmax: z.number().min(0, '0 이상이어야 합니다'),
  multiocc: z.number(),
})

export type AreaEditFormValues = z.infer<typeof areaEditSchema>
