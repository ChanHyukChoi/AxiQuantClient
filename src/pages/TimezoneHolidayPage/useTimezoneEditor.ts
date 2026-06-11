import { useCallback, useEffect, useRef, useState } from 'react'
import type { TimezoneInfo } from '@/types/api'

interface UseTimezoneEditorOptions {
  item: TimezoneInfo | null
  useMock: boolean
  patchMockItem: (id: number, patch: Partial<TimezoneInfo>) => void
  addMockItem: () => number
  removeMockItem: (id: number) => void
  onDeleted: () => void
}

export const useTimezoneEditor = ({
  item,
  useMock,
  patchMockItem,
  addMockItem,
  removeMockItem,
  onDeleted,
}: UseTimezoneEditorOptions) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const enterEditOnSelectRef = useRef(false)

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

  const handleSave = useCallback(() => {
    if (!item) return
    setActionError(null)
    if (useMock) {
      patchMockItem(item.id, { name: draftName.trim() || item.name })
      setEditMode(false)
      return
    }
    setActionError('저장하지 못했습니다.')
  }, [item, useMock, patchMockItem, draftName])

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
    handleEdit,
    handleCancel,
    handleSave,
    handleAdd,
    handleDeleteConfirm,
  }
}
