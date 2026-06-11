import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userEditSchema, type UserEditFormValues } from '@/pages/UsersPage/formTypes'
import {
  emptyUserForm,
  formToCreatePayload,
  formToUpdatePayload,
  userToForm,
} from '@/pages/UsersPage/utils/userHelpers'
import { useCreateUser, useDeleteUser, useUpdateUser } from '@/hooks/api/useUsers'
import type { UserInfo } from '@/types/api/user'

interface UseUserEditorOptions {
  user: UserInfo | null
  useMock: boolean
  patchMockUser: (id: number, patch: Partial<UserInfo>) => void
  addMockUser: (user: Omit<UserInfo, 'id'>) => number
  removeMockUser: (id: number) => void
  onDeleted: () => void
}

export const useUserEditor = ({
  user,
  useMock,
  patchMockUser,
  addMockUser,
  removeMockUser,
  onDeleted,
}: UseUserEditorOptions) => {
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('info')
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const createMut = useCreateUser()
  const updateMut = useUpdateUser()
  const deleteMut = useDeleteUser()

  const form = useForm<UserEditFormValues>({
    resolver: zodResolver(userEditSchema),
    defaultValues: emptyUserForm(),
  })

  const { register, handleSubmit, reset, control, watch, setValue } = form
  const values = watch()

  useEffect(() => {
    setSaveError(null)
    setActiveTab('info')
    if (isCreating) {
      setEditMode(true)
      reset(emptyUserForm())
      return
    }
    setEditMode(false)
    if (user) reset(userToForm(user))
  }, [user?.id, user, isCreating, reset])

  const handleAdd = useCallback(() => {
    setSaveError(null)
    setIsCreating(true)
    setActiveTab('info')
  }, [])

  const handleEdit = useCallback(() => {
    if (!user) return
    setSaveError(null)
    reset(userToForm(user))
    setEditMode(true)
  }, [user, reset])

  const handleCancel = useCallback(() => {
    if (isCreating) {
      setIsCreating(false)
      setSaveError(null)
      return
    }
    if (!user) return
    setEditMode(false)
    setSaveError(null)
    reset(userToForm(user))
  }, [isCreating, user, reset])

  const handleSave = handleSubmit(async (formValues) => {
    setSaveError(null)

    if (isCreating) {
      const pw = formValues.password?.trim() ?? ''
      if (pw.length < 4) {
        setSaveError('신규 사용자는 비밀번호(4자 이상)가 필요합니다.')
        return
      }

      if (useMock) {
        addMockUser({
          ...formToCreatePayload(formValues),
          permissions: formValues.permissions,
        })
        setIsCreating(false)
        setEditMode(false)
        return
      }

      const result = await createMut.mutateAsync(formToCreatePayload(formValues))
      if (result.ok) {
        setIsCreating(false)
        setEditMode(false)
      } else {
        setSaveError(result.message)
      }
      return
    }

    if (!user) return

    if (useMock) {
      patchMockUser(user.id, {
        ...formToUpdatePayload(formValues),
        permissions: formValues.permissions,
      })
      setEditMode(false)
      return
    }

    const result = await updateMut.mutateAsync({
      id: user.id,
      data: formToUpdatePayload(formValues),
    })
    if (result.ok) {
      setEditMode(false)
    } else {
      setSaveError(result.message)
    }
  })

  const handleDeleteConfirm = useCallback(async () => {
    if (!user) return

    if (useMock) {
      removeMockUser(user.id)
      setDeleteOpen(false)
      onDeleted()
      return
    }

    const result = await deleteMut.mutateAsync(user.id)
    if (result.ok) {
      setDeleteOpen(false)
      onDeleted()
    }
  }, [user, useMock, removeMockUser, deleteMut, onDeleted])

  return {
    form,
    register,
    control,
    setValue,
    values,
    activeTab,
    setActiveTab,
    isCreating,
    setIsCreating,
    editMode,
    deleteOpen,
    setDeleteOpen,
    saveError,
    isSaving: createMut.isPending || updateMut.isPending,
    isDeleting: deleteMut.isPending,
    handleAdd,
    handleEdit,
    handleCancel,
    handleSave,
    handleDeleteConfirm,
  }
}
