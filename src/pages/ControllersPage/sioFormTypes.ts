import { z } from 'zod'

export const sioFormSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  active: z.coerce.number().default(0),
  port: z.coerce.number().default(0),
  addr: z.coerce.number().default(0),
  model: z.coerce.number().default(0),
  ext: z.string().default(''),
})

export type SioFormValues = z.infer<typeof sioFormSchema>

export const sioToForm = (sio: {
  name: string
  active: number
  port: number
  addr: number
  model: number
  ext: string
}): SioFormValues => ({
  name: sio.name,
  active: sio.active,
  port: sio.port,
  addr: sio.addr,
  model: sio.model,
  ext: sio.ext ?? '',
})

export const defaultSioFormValues = (): SioFormValues => ({
  name: '새 부제어기',
  active: 1,
  port: 1,
  addr: 0,
  model: 0,
  ext: '',
})
