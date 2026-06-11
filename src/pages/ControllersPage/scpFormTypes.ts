import { z } from 'zod'

export const scpFormSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  active: z.coerce.number().default(0),
  connstr: z.string().default(''),
  model: z.coerce.number().default(0),
  ctype: z.coerce.number().default(0),
  ext: z.string().default(''),
})

export type ScpFormValues = z.infer<typeof scpFormSchema>

export const scpToForm = (scp: {
  name: string
  active: number
  connstr: string
  model: number
  ctype: number
  ext: string
}): ScpFormValues => ({
  name: scp.name,
  active: scp.active,
  connstr: scp.connstr ?? '',
  model: scp.model,
  ctype: scp.ctype,
  ext: scp.ext ?? '',
})

export const scpToUpdatePayload = (scp: {
  name: string
  active: number
  connstr: string
  model: number
  ctype: number
  ext: string
}) => ({
  name: scp.name,
  active: scp.active,
  connstr: scp.connstr ?? '',
  model: scp.model,
  ctype: scp.ctype,
  ext: scp.ext ?? '',
})
