import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  scpFormSchema,
  scpToForm,
  scpToUpdatePayload,
  type ScpFormValues,
} from '@/pages/ControllersPage/scpFormTypes'
import {
  useCreateScp,
  useDeleteScp,
  useResetScp,
  useUpdateScp,
} from '@/hooks/api/useDeviceControl'
import type { CreateScpRequest, ScpInfo } from '@/types/api'

interface UseScpEditorOptions {
  scp: ScpInfo | null
  useMock: boolean
  patchMockScp: (id: number, patch: Partial<ScpInfo>) => void
  removeMockScp: (id: number) => void
  onDeleted?: () => void
}

export const useScpEditor = ({
  scp,
  useMock,
  patchMockScp,
  removeMockScp,
  onDeleted,
}: UseScpEditorOptions) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const updateScpMut = useUpdateScp()
  const deleteScpMut = useDeleteScp()
  const resetScpMut = useResetScp()
  const createScpMut = useCreateScp()

  const form = useForm<ScpFormValues>({
    resolver: zodResolver(scpFormSchema),
    defaultValues: scpToForm({
      name: '',
      active: 1,
      connstr: '',
      model: 0,
      ctype: 0,
      ext: '',
    }),
  })

  useEffect(() => {
    setEditMode(false)
    setActionError(null)
    if (scp) form.reset(scpToForm(scp))
  }, [scp?.id, scp, form])

  const buildPayload = (values: ScpFormValues) => ({
    name: values.name.trim(),
    active: Number(values.active) || 0,
    connstr: values.connstr ?? '',
    model: Number(values.model) || 0,
    ctype: Number(values.ctype) || 0,
    ext: values.ext ?? '',
  })

  const handleEdit = () => {
    if (!scp) return
    setActionError(null)
    form.reset(scpToForm(scp))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (!scp) return
    setEditMode(false)
    setActionError(null)
    form.reset(scpToForm(scp))
  }

  const handleSave = form.handleSubmit(async (values) => {
    if (!scp) return
    setActionError(null)
    const payload = buildPayload(values)

    if (useMock) {
      patchMockScp(scp.id, payload)
      setEditMode(false)
      return
    }

    const ok = await updateScpMut.mutateAsync({ id: scp.id, data: payload })
    if (ok) setEditMode(false)
    else setActionError('저장하지 못했습니다.')
  })

  const handleToggleActive = async (active: boolean) => {
    if (!scp || editMode) return
    setActionError(null)
    const nextActive = active ? 1 : 0
    const payload = { ...scpToUpdatePayload(scp), active: nextActive }

    if (useMock) {
      patchMockScp(scp.id, { active: nextActive })
      return
    }

    const ok = await updateScpMut.mutateAsync({ id: scp.id, data: payload })
    if (!ok) setActionError('활성 상태를 변경하지 못했습니다.')
  }

  const handleDeleteConfirm = async () => {
    if (!scp) return
    setActionError(null)

    if (useMock) {
      removeMockScp(scp.id)
      setDeleteOpen(false)
      onDeleted?.()
      return
    }

    const ok = await deleteScpMut.mutateAsync(scp.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted?.()
    } else {
      setActionError('삭제하지 못했습니다.')
    }
  }

  const handleResetConfirm = async () => {
    if (!scp) return
    setActionError(null)

    if (useMock) {
      setResetOpen(false)
      return
    }

    const ok = await resetScpMut.mutateAsync(scp.id)
    if (ok) setResetOpen(false)
    else setActionError('초기화하지 못했습니다.')
  }

  const createScp = async (data: CreateScpRequest): Promise<boolean> => {
    if (useMock) return true
    return createScpMut.mutateAsync(data)
  }

  const isSaving = updateScpMut.isPending || createScpMut.isPending
  const isDeleting = deleteScpMut.isPending
  const isResetting = resetScpMut.isPending

  return {
    form,
    editMode,
    deleteOpen,
    resetOpen,
    actionError,
    setDeleteOpen,
    setResetOpen,
    handleEdit,
    handleCancel,
    handleSave,
    handleToggleActive,
    handleDeleteConfirm,
    handleResetConfirm,
    createScp,
    isSaving,
    isDeleting,
    isResetting,
    createPending: createScpMut.isPending,
  }
}
