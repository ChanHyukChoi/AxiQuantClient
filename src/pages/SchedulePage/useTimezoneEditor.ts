import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useCreateTimezone,
  useDeleteTimezone,
  useUpdateTimezone,
} from '@/hooks/api/useTimezone'
import type { CreateTimezoneRequest, TimezoneInfo } from '@/types/api'

const defaultTimezonePayload = (): CreateTimezoneRequest => ({
  name: '새 타임존',
  intervals: [{ idx: 0, dmask: 127, hmask: 0, stm: '09:00', etm: '18:00' }],
  startTime: '09:00',
  endTime: '18:00',
  daysOfWeek: 127,
})

interface UseTimezoneEditorOptions {
  item: TimezoneInfo | null
  onDeleted: () => void
  onCreated?: () => void
}

export const useTimezoneEditor = ({ item, onDeleted, onCreated }: UseTimezoneEditorOptions) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const enterEditOnSelectRef = useRef(false)

  const createMut = useCreateTimezone()
  const updateMut = useUpdateTimezone()
  const deleteMut = useDeleteTimezone()

  useEffect(() => {
    if (enterEditOnSelectRef.current) {
      enterEditOnSelectRef.current = false
      setEditMode(true)
    } else {
      setEditMode(false)
    }
    setActionError(null)
    setDraftName(item?.name ?? '')
  }, [item?.id, item])

  const handleEdit = useCallback(() => {
    if (!item) return
    setDraftName(item.name)
    setEditMode(true)
  }, [item])

  const handleCancel = useCallback(() => {
    if (!item) return
    setDraftName(item.name)
    setEditMode(false)
    setActionError(null)
  }, [item])

  const handleSave = useCallback(async () => {
    if (!item) return
    setActionError(null)
    const ok = await updateMut.mutateAsync({
      id: item.id,
      data: { ...item, name: draftName.trim() || item.name },
    })
    if (ok) setEditMode(false)
    else setActionError('저장하지 못했습니다.')
  }, [item, updateMut, draftName])

  const handleAdd = useCallback(async () => {
    setActionError(null)
    const ok = await createMut.mutateAsync(defaultTimezonePayload())
    if (ok) {
      enterEditOnSelectRef.current = true
      onCreated?.()
    } else {
      setActionError('추가하지 못했습니다.')
    }
  }, [createMut, onCreated])

  const handleDeleteConfirm = useCallback(async () => {
    if (!item) return
    const ok = await deleteMut.mutateAsync(item.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    } else {
      setActionError('삭제하지 못했습니다.')
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
