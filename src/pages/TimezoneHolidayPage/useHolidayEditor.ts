import { useCallback, useEffect, useRef, useState } from 'react'
import type { HolidayInfo } from '@/types/api'

interface UseHolidayEditorOptions {
  item: HolidayInfo | null
  useMock: boolean
  patchMockItem: (id: number, patch: Partial<HolidayInfo>) => void
  addMockItem: () => number
  removeMockItem: (id: number) => void
  onDeleted: () => void
}

export const useHolidayEditor = ({
  item,
  useMock,
  patchMockItem,
  addMockItem,
  removeMockItem,
  onDeleted,
}: UseHolidayEditorOptions) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [draftDate, setDraftDate] = useState('')
  const [draftRecurring, setDraftRecurring] = useState(false)
  const enterEditOnSelectRef = useRef(false)

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

  const handleSave = useCallback(() => {
    if (!item) return
    setActionError(null)
    if (useMock) {
      patchMockItem(item.id, {
        name: draftName.trim() || item.name,
        date: draftDate.trim() || item.date,
        isRecurring: draftRecurring,
      })
      setEditMode(false)
      return
    }
    setActionError('저장하지 못했습니다.')
  }, [item, useMock, patchMockItem, draftName, draftDate, draftRecurring])

  const handleAdd = useCallback(() => {
    setActionError(null)
    if (useMock) {
      enterEditOnSelectRef.current = true
      addMockItem()
      return
    }
    setActionError('추가하지 못했습니다.')
  }, [useMock, addMockItem])

  const handleDeleteConfirm = useCallback(() => {
    if (!item) return
    if (useMock) {
      removeMockItem(item.id)
      setDeleteOpen(false)
      onDeleted()
      return
    }
    setActionError('삭제하지 못했습니다.')
    setDeleteOpen(false)
  }, [item, useMock, removeMockItem, onDeleted])

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
  }
}
