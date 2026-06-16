import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  defaultSioFormValues,
  sioFormSchema,
  sioToForm,
  type SioFormValues,
} from '@/pages/ControllersPage/sioFormTypes'
import { useCreateSio, useDeleteSio, useUpdateSio } from '@/hooks/api/useDeviceControl'
import type { SioInfo } from '@/types/api'

interface UseSioEditorOptions {
  sio: SioInfo | null
  scpId: number
  onAdded: (id: number) => void
  onDeleted: () => void
}

const buildPayload = (values: SioFormValues) => ({
  name: values.name.trim(),
  active: Number(values.active) || 0,
  port: Number(values.port) || 0,
  addr: Number(values.addr) || 0,
  model: Number(values.model) || 0,
  ext: values.ext ?? '',
})

export const useSioEditor = ({ sio, scpId, onAdded, onDeleted }: UseSioEditorOptions) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const enterEditOnSelectRef = useRef(false)

  const createMut = useCreateSio()
  const updateMut = useUpdateSio()
  const deleteMut = useDeleteSio()

  const form = useForm<SioFormValues>({
    resolver: zodResolver(sioFormSchema),
    defaultValues: defaultSioFormValues(),
  })

  useEffect(() => {
    setDeleteOpen(false)
    setActionError(null)
    if (enterEditOnSelectRef.current && sio) {
      enterEditOnSelectRef.current = false
      form.reset(sioToForm(sio))
      setEditMode(true)
      return
    }
    setEditMode(false)
    if (sio) form.reset(sioToForm(sio))
  }, [sio?.id, sio, scpId, form])

  const handleEdit = () => {
    if (!sio) return
    setActionError(null)
    form.reset(sioToForm(sio))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (!sio) return
    setEditMode(false)
    setActionError(null)
    form.reset(sioToForm(sio))
  }

  const handleSave = form.handleSubmit(async (values) => {
    if (!sio || scpId <= 0) return
    setActionError(null)
    const payload = buildPayload(values)

    const ok = await updateMut.mutateAsync({ scpId, id: sio.id, data: payload })
    if (ok) setEditMode(false)
    else setActionError('저장하지 못했습니다.')
  })

  const handleToggleActive = async (active: boolean) => {
    if (!sio || editMode || scpId <= 0) return
    setActionError(null)
    const nextActive = active ? 1 : 0

    const ok = await updateMut.mutateAsync({
      scpId,
      id: sio.id,
      data: { ...buildPayload(sioToForm(sio)), active: nextActive },
    })
    if (!ok) setActionError('활성 상태를 변경하지 못했습니다.')
  }

  const handleDeleteConfirm = async () => {
    if (!sio || scpId <= 0) return
    setActionError(null)

    const ok = await deleteMut.mutateAsync({ scpId, id: sio.id })
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    } else {
      setActionError('삭제하지 못했습니다.')
    }
  }

  const handleAdd = useCallback(async () => {
    if (scpId <= 0) return
    setActionError(null)
    setIsAdding(true)
    const payload = defaultSioFormValues()

    try {
      const ok = await createMut.mutateAsync({ scpId, data: payload })
      if (!ok) {
        setActionError('추가하지 못했습니다.')
        return
      }
      onAdded(-1)
    } finally {
      setIsAdding(false)
    }
  }, [scpId, onAdded, createMut])

  return {
    form,
    editMode,
    deleteOpen,
    actionError,
    isAdding,
    setDeleteOpen,
    handleEdit,
    handleCancel,
    handleSave,
    handleToggleActive,
    handleDeleteConfirm,
    handleAdd,
    enterEditOnSelectRef,
    isSaving: updateMut.isPending,
    isDeleting: deleteMut.isPending,
  }
}
