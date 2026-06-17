import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
  createScpFormSchema,
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

const CREATE_DEFAULTS: ScpFormValues = {
  name: '',
  active: 1,
  connstr: '',
  model: 0,
  ctype: 0,
  ext: '',
}

interface UseScpEditorOptions {
  scp: ScpInfo | null
  createMode?: boolean
  onCreateCancel?: () => void
  onCreated?: (data: CreateScpRequest) => void | Promise<void>
  onDeleted?: () => void
}

export const useScpEditor = ({
  scp,
  createMode = false,
  onCreateCancel,
  onCreated,
  onDeleted,
}: UseScpEditorOptions) => {
  const { t } = useTranslation(['common', 'device'])
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const updateScpMut = useUpdateScp()
  const deleteScpMut = useDeleteScp()
  const resetScpMut = useResetScp()
  const createScpMut = useCreateScp()

  const form = useForm<ScpFormValues>({
    resolver: zodResolver(createScpFormSchema(t)),
    defaultValues: CREATE_DEFAULTS,
  })

  useEffect(() => {
    if (createMode) {
      setEditMode(false)
      setActionError(null)
      form.reset(CREATE_DEFAULTS)
      return
    }
    setEditMode(false)
    setActionError(null)
    if (scp) form.reset(scpToForm(scp))
  }, [scp?.id, scp, createMode, form])

  const buildPayload = (values: ScpFormValues): CreateScpRequest => ({
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
    if (createMode) {
      setActionError(null)
      form.reset(CREATE_DEFAULTS)
      onCreateCancel?.()
      return
    }
    if (!scp) return
    setEditMode(false)
    setActionError(null)
    form.reset(scpToForm(scp))
  }

  const handleSave = form.handleSubmit(async (values) => {
    setActionError(null)
    const payload = buildPayload(values)

    if (createMode) {
      const ok = await createScpMut.mutateAsync(payload)
      if (ok) {
        form.reset(CREATE_DEFAULTS)
        await onCreated?.(payload)
      } else {
        setActionError(t('error.addFailed'))
      }
      return
    }

    if (!scp) return
    const ok = await updateScpMut.mutateAsync({ id: scp.id, data: payload })
    if (ok) setEditMode(false)
    else setActionError(t('error.saveFailed'))
  })

  const handleToggleActive = async (active: boolean) => {
    if (!scp || editMode) return
    setActionError(null)
    const nextActive = active ? 1 : 0
    const payload = { ...scpToUpdatePayload(scp), active: nextActive }

    const ok = await updateScpMut.mutateAsync({ id: scp.id, data: payload })
    if (!ok) setActionError(t('error.toggleActiveFailed'))
  }

  const handleDeleteConfirm = async () => {
    if (!scp) return
    setActionError(null)

    const ok = await deleteScpMut.mutateAsync(scp.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted?.()
    } else {
      setActionError(t('error.deleteFailed'))
    }
  }

  const handleResetConfirm = async () => {
    if (!scp) return
    setActionError(null)

    const ok = await resetScpMut.mutateAsync(scp.id)
    if (ok) setResetOpen(false)
    else setActionError(t('error.resetFailed'))
  }

  const isSaving = updateScpMut.isPending || createScpMut.isPending
  const isDeleting = deleteScpMut.isPending
  const isResetting = resetScpMut.isPending

  return {
    form,
    editMode: createMode ? true : editMode,
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
    isSaving,
    isDeleting,
    isResetting,
  }
}
