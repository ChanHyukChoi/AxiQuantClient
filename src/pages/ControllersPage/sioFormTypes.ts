import { z } from 'zod'
import i18n from '@/lib/i18n'

export const sioFormSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  active: z.number(),
  port: z.number(),
  addr: z.number(),
  model: z.number(),
  ext: z.string(),
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
  name: i18n.t('sio.newDefaultName', { ns: 'device' }),
  active: 1,
  port: 1,
  addr: 0,
  model: 0,
  ext: '',
})
