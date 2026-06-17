import type { TFunction } from 'i18next'
import { z } from 'zod'

export const createAlarmRuleSchema = (t: TFunction<'alarm'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    active: z.number(),
    deviceId: z.number().min(0),
    deviceType: z.string(),
    eventCondition: z.string(),
  })

export const createAlarmRuleFormSchema = (t: TFunction<'alarm'>) =>
  z.object({
    name: z.string().min(1, t('validation.nameRequired')),
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

export type AlarmRuleFormValues = z.infer<ReturnType<typeof createAlarmRuleFormSchema>>

const hexColorSchema = (t: TFunction<'alarm'>) =>
  z.string().regex(/^#[0-9A-Fa-f]{6}$/, t('validation.hexColor'))

export const createAlarmPrioritySchema = (t: TFunction<'alarm'>) =>
  z.object({
    priority: z.number().min(1).max(100),
    color: hexColorSchema(t),
  })

export const createAlarmPriorityFormSchema = (t: TFunction<'alarm'>) =>
  z.object({
    priority: z.number().min(1).max(100),
    alarmFg: hexColorSchema(t),
    alarmBg: hexColorSchema(t),
    alarmBgEnabled: z.boolean(),
    ackFg: hexColorSchema(t),
    ackBg: hexColorSchema(t),
    ackBgEnabled: z.boolean(),
    blinking: z.string(),
    alarmSound: z.string(),
  })

export type AlarmPriorityFormValues = z.infer<ReturnType<typeof createAlarmPriorityFormSchema>>

export const createAlarmMailSchema = (t: TFunction<'alarm'>) => {
  const emailSchema = z.string().email(t('validation.emailInvalid'))
  return z.object({
    name: z.string().min(1, t('validation.nameRequired')),
    alarmIds: z.array(z.number()),
    emails: z.array(emailSchema).min(1, t('validation.emailsMin')),
  })
}

export type AlarmMailFormValues = z.infer<ReturnType<typeof createAlarmMailSchema>>
