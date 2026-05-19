import { z } from 'zod'

export const deviceControlFormSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  active: z.coerce.number().default(0),
  connstr: z.string().optional(),
  model: z.coerce.number().optional(),
  ctype: z.coerce.number().optional(),
  ext: z.string().optional(),
  port: z.coerce.number().optional(),
  addr: z.coerce.number().optional(),
  scp: z.coerce.number().optional(),
  sio: z.coerce.number().optional(),
  ifcode: z.coerce.number().optional(),
  mode: z.coerce.number().optional(),
  defpulse: z.coerce.number().optional(),
})

export type DeviceControlFormValues = z.infer<typeof deviceControlFormSchema>
