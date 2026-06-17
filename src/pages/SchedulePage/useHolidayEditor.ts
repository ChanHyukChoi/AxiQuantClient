import { useCallback, useEffect, useRef, useState } from 'react'
import i18n from '@/lib/i18n'
import { useCreateHoliday, useDeleteHoliday, useUpdateHoliday } from '@/hooks/api/useHoliday'
import type { HolidayInfo } from '@/types/api'

interface UseHolidayEditorOptions {
  timezoneId: number | null
  item: HolidayInfo | null
  onDeleted: () => void
  onCreated?: () => void
}

export const useHolidayEditor = ({
  timezoneId,
  item,
  onDeleted,
  onCreated,
}: UseHolidayEditorOptions) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftDate, setDraftDate] = useState('')
  const [draftRecurring, setDraftRecurring] = useState(false)
  const enterEditOnSelectRef = useRef(false)

  const createMut = useCreateHoliday()
  const updateMut = useUpdateHoliday()
  const deleteMut = useDeleteHoliday()

  useEffect(() => {
    if (enterEditOnSelectRef.current) {
      enterEditOnSelectRef.current = false
      setEditMode(true)
    } else {
      setEditMode(false)
    }
    setActionError(null)
    if (item) {
      setDraftName(item.name)
      setDraftDate(item.date)
      setDraftRecurring(item.isRecurring ?? false)
    }
  }, [item?.id, item])

  const handleEdit = useCallback(() => {
    if (!item) return
    setDraftName(item.name)
    setDraftDate(item.date)
    setDraftRecurring(item.isRecurring ?? false)
    setEditMode(true)
  }, [item])

  const handleCancel = useCallback(() => {
    if (!item) return
    setDraftName(item.name)
    setDraftDate(item.date)
    setDraftRecurring(item.isRecurring ?? false)
    setEditMode(false)
    setActionError(null)
  }, [item])

  const handleSave = useCallback(async () => {
    if (!item) return
    setActionError(null)
    const ok = await updateMut.mutateAsync({
      id: item.id,
      data: {
        timezoneId: item.timezoneId,
        name: draftName.trim() || item.name,
        date: draftDate.trim() || item.date,
        isRecurring: draftRecurring,
      },
    })
    if (ok) setEditMode(false)
    else setActionError(i18n.t('error.saveFailed', { ns: 'schedule' }))
  }, [item, updateMut, draftName, draftDate, draftRecurring])

  const handleAdd = useCallback(async () => {
    if (timezoneId == null) return
    setActionError(null)
    const ok = await createMut.mutateAsync({
      timezoneId,
      name: i18n.t('holiday.newDefaultName', { ns: 'schedule' }),
      date: '01-01',
      isRecurring: true,
    })
    if (ok) {
      enterEditOnSelectRef.current = true
      onCreated?.()
    } else {
      setActionError(i18n.t('error.addFailed', { ns: 'schedule' }))
    }
  }, [timezoneId, createMut, onCreated])

  const handleDeleteConfirm = useCallback(async () => {
    if (!item) return
    const ok = await deleteMut.mutateAsync(item.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    } else {
      setActionError(i18n.t('error.deleteFailed', { ns: 'schedule' }))
      setDeleteOpen(false)
    }
  }, [item, deleteMut, onDeleted])

  return {
    editMode,
    deleteOpen,
    setDeleteOpen,
    actionError,
    draftName,
    setDraftName,
    draftDate,
    setDraftDate,
    draftRecurring,
    setDraftRecurring,
    handleEdit,
    handleCancel,
    handleSave,
    handleAdd,
    handleDeleteConfirm,
    isSaving: updateMut.isPending,
    isDeleting: deleteMut.isPending,
    isAdding: createMut.isPending,
  }
}
