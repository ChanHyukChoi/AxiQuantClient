import { z } from 'zod'

export const alarmRuleSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  active: z.number(),
  deviceId: z.number().min(0),
  deviceType: z.string().min(1, '장치를 선택하세요'),
  eventCondition: z.string(),
})

export type AlarmRuleFormValues = z.infer<typeof alarmRuleSchema>

export const alarmPrioritySchema = z.object({
  priority: z.number().min(0, '0 이상이어야 합니다'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상(#RRGGBB)을 입력하세요'),
})

export type AlarmPriorityFormValues = z.infer<typeof alarmPrioritySchema>

const emailSchema = z.string().email('올바른 이메일 형식이 아닙니다')

export const alarmMailSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  alarmIds: z.array(z.number()),
  emails: z.array(emailSchema).min(1, '수신 이메일을 1개 이상 추가하세요'),
})

export type AlarmMailFormValues = z.infer<typeof alarmMailSchema>
