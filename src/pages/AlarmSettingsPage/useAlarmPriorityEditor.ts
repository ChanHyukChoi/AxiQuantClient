import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  alarmPriorityFormSchema,
  type AlarmPriorityFormValues,
} from '@/pages/AlarmSettingsPage/formTypes'
import type { AlarmPriorityDisplay } from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import {
  normalizeHexColor,
  priorityToUpdatePayload,
} from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import {
  useCreateAlarmPriority,
  useDeleteAlarmPriority,
  useUpdateAlarmPriority,
} from '@/hooks/api/useAlarmSettings'

interface UseAlarmPriorityEditorOptions {
  item: AlarmPriorityDisplay | null
  onDeleted: () => void
}

const itemToForm = (item: AlarmPriorityDisplay): AlarmPriorityFormValues => ({
  priority: item.priority,
  alarmFg: normalizeHexColor(item.alarmFg),
  alarmBg: normalizeHexColor(item.alarmBg),
  alarmBgEnabled: item.alarmBgEnabled,
  ackFg: normalizeHexColor(item.ackFg),
  ackBg: normalizeHexColor(item.ackBg),
  ackBgEnabled: item.ackBgEnabled,
  blinking: item.blinking,
  alarmSound: item.alarmSound,
})

export const useAlarmPriorityEditor = ({ item, onDeleted }: UseAlarmPriorityEditorOptions) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const enterEditOnSelectRef = useRef(false)

  const createMut = useCreateAlarmPriority()
  const updateMut = useUpdateAlarmPriority()
  const deleteMut = useDeleteAlarmPriority()

  const form = useForm<AlarmPriorityFormValues>({
    resolver: zodResolver(alarmPriorityFormSchema),
    defaultValues: {
      priority: 10,
      alarmFg: '#4f9cf9',
      alarmBg: '#1a1a1a',
      alarmBgEnabled: false,
      ackFg: '#888888',
      ackBg: '#1a1a1a',
      ackBgEnabled: false,
      blinking: 'off',
      alarmSound: 'none',
    },
  })

  const { reset, handleSubmit } = form

  useEffect(() => {
    if (enterEditOnSelectRef.current) {
      enterEditOnSelectRef.current = false
      setEditMode(true)
    } else {
      setEditMode(false)
    }
    setActionError(null)
    if (item) reset(itemToForm(item))
  }, [item?.id, item, reset])

  const handleEdit = useCallback(() => {
    if (!item) return
    setActionError(null)
    reset(itemToForm(item))
    setEditMode(true)
  }, [item, reset])

  const handleCancel = useCallback(() => {
    if (!item) return
    setEditMode(false)
    setActionError(null)
    reset(itemToForm(item))
  }, [item, reset])

  const handleSave = handleSubmit(async (values) => {
    if (!item) return
    setActionError(null)

    const ok = await updateMut.mutateAsync({
      id: item.id,
      data: {
        ...priorityToUpdatePayload(item),
        priority: values.priority,
        color: normalizeHexColor(values.alarmFg),
      },
    })
    if (ok) setEditMode(false)
    else setActionError('저장하지 못했습니다.')
  })

  const handleAdd = useCallback(async () => {
    setActionError(null)
    const ok = await createMut.mutateAsync({
      priority: 50,
      color: '#4f9cf9',
    })
    if (!ok) setActionError('추가하지 못했습니다.')
  }, [createMut])

  const handleDeleteConfirm = useCallback(async () => {
    if (!item) return
    setActionError(null)

    const ok = await deleteMut.mutateAsync(item.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    } else setActionError('삭제하지 못했습니다.')
  }, [item, deleteMut, onDeleted])

  return {
    form,
    editMode,
    deleteOpen,
    setDeleteOpen,
    actionError,
    isSaving: updateMut.isPending,
    isDeleting: deleteMut.isPending,
    isAdding: createMut.isPending,
    handleEdit,
    handleCancel,
    handleSave,
    handleAdd,
    handleDeleteConfirm,
  }
}
