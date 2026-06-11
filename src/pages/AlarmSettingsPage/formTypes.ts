import { z } from 'zod'

export const alarmRuleSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  active: z.number(),
  deviceId: z.number().min(0),
  deviceType: z.string(),
  eventCondition: z.string(),
})

export const alarmRuleFormSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  active: z.number(),
  eventCode: z.string(),
  scpId: z.number().min(0),
  deviceId: z.number().min(0),
  deviceType: z.string(),
  eventCondition: z.string(),
  priority: z.number().min(1).max(100),
  monitoring: z.boolean(),
  ackRequired: z.boolean(),
  alarmSound: z.string(),
  timezone: z.string(),
  userIds: z.array(z.number()),
})

export type AlarmRuleFormValues = z.infer<typeof alarmRuleFormSchema>

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, '올바른 HEX 색상(#RRGGBB)을 입력하세요')

export const alarmPrioritySchema = z.object({
  priority: z.number().min(1).max(100),
  color: hexColorSchema,
})

export const alarmPriorityFormSchema = z.object({
  priority: z.number().min(1).max(100),
  alarmFg: hexColorSchema,
  alarmBg: hexColorSchema,
  alarmBgEnabled: z.boolean(),
  ackFg: hexColorSchema,
  ackBg: hexColorSchema,
  ackBgEnabled: z.boolean(),
  blinking: z.string(),
  alarmSound: z.string(),
})

export type AlarmPriorityFormValues = z.infer<typeof alarmPriorityFormSchema>

const emailSchema = z.string().email('올바른 이메일 형식이 아닙니다')

export const alarmMailSchema = z.object({
  name: z.string().min(1, '명칭을 입력하세요'),
  alarmIds: z.array(z.number()),
  emails: z.array(emailSchema).min(1, '수신 이메일을 1개 이상 추가하세요'),
})

export type AlarmMailFormValues = z.infer<typeof alarmMailSchema>
