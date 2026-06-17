import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createAlarmRuleFormSchema,
  type AlarmRuleFormValues,
} from '@/pages/AlarmSettingsPage/formTypes'
import type { AlarmRuleDisplay } from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import {
  alarmToUpdatePayload,
  deviceDisplayLabel,
} from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import { useCreateAlarm, useDeleteAlarm, useUpdateAlarm } from '@/hooks/api/useAlarmSettings'

interface UseAlarmRuleEditorOptions {
  rule: AlarmRuleDisplay | null
  scpNameMap: Record<number, string>
  onDeleted: () => void
}

const ruleToForm = (rule: AlarmRuleDisplay): AlarmRuleFormValues => ({
  name: rule.name,
  active: rule.active,
  eventCode: rule.eventCode,
  scpId: rule.scpId,
  deviceId: rule.deviceId,
  deviceType: rule.deviceType,
  eventCondition: rule.eventCondition ?? '',
  priority: rule.priority,
  monitoring: rule.monitoring,
  ackRequired: rule.ackRequired,
  alarmSound: rule.alarmSound,
  timezone: rule.timezone,
  userIds: [...rule.userIds],
})

export const useAlarmRuleEditor = ({
  rule,
  scpNameMap,
  onDeleted,
}: UseAlarmRuleEditorOptions) => {
  const { t } = useTranslation('alarm')
  const alarmRuleFormSchema = useMemo(() => createAlarmRuleFormSchema(t), [t])
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [devicePickerOpen, setDevicePickerOpen] = useState(false)
  const [deviceLabel, setDeviceLabel] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const enterEditOnSelectRef = useRef(false)

  const createMut = useCreateAlarm()
  const updateMut = useUpdateAlarm()
  const deleteMut = useDeleteAlarm()

  const form = useForm<AlarmRuleFormValues>({
    resolver: zodResolver(alarmRuleFormSchema),
    defaultValues: {
      name: '',
      active: 1,
      eventCode: '',
      scpId: 0,
      deviceId: 0,
      deviceType: '',
      eventCondition: '',
      priority: 50,
      monitoring: true,
      ackRequired: false,
      alarmSound: 'none',
      timezone: 'default',
      userIds: [],
    },
  })

  const { reset, setValue, handleSubmit } = form

  useEffect(() => {
    if (enterEditOnSelectRef.current) {
      enterEditOnSelectRef.current = false
      setEditMode(true)
    } else {
      setEditMode(false)
    }
    setActionError(null)
    if (rule) {
      reset(ruleToForm(rule))
      setDeviceLabel(deviceDisplayLabel(rule.deviceType, rule.deviceId, scpNameMap))
    } else {
      setDeviceLabel('')
    }
  }, [rule?.id, rule, reset, scpNameMap])

  const handleEdit = useCallback(() => {
    if (!rule) return
    setActionError(null)
    reset(ruleToForm(rule))
    setEditMode(true)
  }, [rule, reset])

  const handleCancel = useCallback(() => {
    if (!rule) return
    setEditMode(false)
    setActionError(null)
    reset(ruleToForm(rule))
    setDeviceLabel(deviceDisplayLabel(rule.deviceType, rule.deviceId, scpNameMap))
  }, [rule, reset, scpNameMap])

  const handleSave = handleSubmit(async (values) => {
    if (!rule) return
    setActionError(null)

    const ok = await updateMut.mutateAsync({
      id: rule.id,
      data: {
        ...alarmToUpdatePayload(rule),
        name: values.name,
        active: values.active,
        deviceId: values.deviceId,
        deviceType: values.deviceType,
        eventCondition: values.eventCode,
      },
    })
    if (ok) setEditMode(false)
    else setActionError(t('error.saveFailed'))
  })

  const handleAdd = useCallback(async () => {
    setActionError(null)
    const ok = await createMut.mutateAsync({
      name: t('rule.newDefaultName'),
      active: 1,
      deviceId: 0,
      deviceType: '',
      eventCondition: '',
    })
    if (!ok) setActionError(t('error.addFailed'))
  }, [createMut, t])

  const handleDeleteConfirm = useCallback(async () => {
    if (!rule) return
    setActionError(null)

    const ok = await deleteMut.mutateAsync(rule.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    } else setActionError(t('error.deleteFailed'))
  }, [rule, deleteMut, onDeleted, t])

  const handleDevicePick = useCallback(
    (deviceType: string, deviceId: number, label: string) => {
      setValue('deviceType', deviceType, { shouldDirty: true })
      setValue('deviceId', deviceId, { shouldDirty: true })
      setDeviceLabel(label)
      setDevicePickerOpen(false)
    },
    [setValue],
  )

  const toggleUserId = useCallback(
    (userId: number, checked: boolean) => {
      const current = form.getValues('userIds')
      const next = checked
        ? [...new Set([...current, userId])]
        : current.filter((id) => id !== userId)
      setValue('userIds', next, { shouldDirty: true })
    },
    [form, setValue],
  )

  return {
    form,
    editMode,
    setEditMode,
    deleteOpen,
    setDeleteOpen,
    devicePickerOpen,
    setDevicePickerOpen,
    deviceLabel,
    actionError,
    isSaving: updateMut.isPending,
    isDeleting: deleteMut.isPending,
    isAdding: createMut.isPending,
    handleEdit,
    handleCancel,
    handleSave,
    handleAdd,
    handleDeleteConfirm,
    handleDevicePick,
    toggleUserId,
  }
}
