import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Shield } from 'lucide-react'
import { DetailInfoField } from '@/components/basic/DetailInfoField'
import { DetailTitleBar } from '@/components/basic/DetailTitleBar'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { CrudDetailActions } from '@/components/page-actions'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { AccLvReaderEditModal } from '@/pages/AccessPage/components/AccLvReaderEditModal'
import { AccLvReaderTable } from '@/pages/AccessPage/components/AccLvReaderTable'
import { createAccLvSchema, type AccLvFormValues } from '@/pages/AccessPage/formTypes'
import { toAccLvReaderRows } from '@/pages/AccessPage/utils/accLvHelpers'
import {
  fallbackAccLvName,
  fallbackScpName,
  fallbackTimezoneName,
} from '@/lib/entityDisplayLabels'
import {
  useAccLvReaderList,
  useDeleteAccLv,
  useUpdateAccLv,
} from '@/hooks/api/useAccLv'
import { useScps } from '@/hooks/api/useDeviceControl'
import { useTimezoneList } from '@/hooks/api/useTimezone'
import type { AccLvInfo, UpdateAccLvRequest } from '@/types/api'

interface AccessDetailPanelProps {
  accLv: AccLvInfo | null
  onDeleted: () => void
  onEditModeChange?: (editing: boolean) => void
}

export const AccessDetailPanel = ({
  accLv,
  onDeleted,
  onEditModeChange,
}: AccessDetailPanelProps) => {
  const { t } = useTranslation(['access', 'common'])
  const accLvSchema = useMemo(() => createAccLvSchema(t), [t])
  const selectedId = accLv?.id ?? 0
  const [editMode, setEditMode] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [readerEditOpen, setReaderEditOpen] = useState(false)

  const { data: readerList, isLoading: readerLoading } = useAccLvReaderList(selectedId)
  const { data: scpList } = useScps()
  const { data: timezoneList } = useTimezoneList()

  const { mutate: updateAccLv, isPending: isUpdating } = useUpdateAccLv()
  const { mutate: deleteAccLv, isPending: isDeleting } = useDeleteAccLv()

  const updateForm = useForm<AccLvFormValues>({
    resolver: zodResolver(accLvSchema),
  })

  useEffect(() => {
    setEditMode(false)
    setReaderEditOpen(false)
    onEditModeChange?.(false)
  }, [accLv?.id, onEditModeChange])

  const setEditing = (editing: boolean) => {
    setEditMode(editing)
    onEditModeChange?.(editing)
  }

  const scpNameMap = useMemo(() => {
    if (!scpList) return {} as Record<number, string>
    return scpList.reduce<Record<number, string>>((acc, s) => {
      acc[s.id] = fallbackScpName(s.name)
      return acc
    }, {})
  }, [scpList])

  const timezoneNameMap = useMemo(() => {
    if (!timezoneList) return {} as Record<number, string>
    return timezoneList.reduce<Record<number, string>>((acc, tz) => {
      acc[tz.id] = fallbackTimezoneName(tz.name)
      return acc
    }, {})
  }, [timezoneList])

  const readerRows = useMemo(
    () => toAccLvReaderRows(readerList ?? [], scpNameMap, timezoneNameMap),
    [readerList, scpNameMap, timezoneNameMap],
  )

  const onEditClick = () => {
    if (!accLv) return
    updateForm.reset({ name: accLv.name })
    setEditing(true)
  }

  const handleCancelEdit = () => {
    setEditing(false)
    updateForm.reset()
  }

  const onUpdateSubmit = (values: AccLvFormValues) => {
    if (!selectedId || !accLv) return
    const data: UpdateAccLvRequest = {
      name: values.name.trim(),
      description: accLv.description,
    }
    updateAccLv(
      { id: selectedId, data },
      {
        onSuccess: (ok) => {
          if (!ok) return
          setEditing(false)
        },
      },
    )
  }

  const handleSave = updateForm.handleSubmit(onUpdateSubmit)

  const handleDeleteConfirm = () => {
    if (selectedId <= 0) return
    deleteAccLv(selectedId, {
      onSuccess: (ok) => {
        if (!ok) return
        setDeleteModalOpen(false)
        onDeleted()
      },
    })
  }

  const drawerHeader = accLv ? (
    <DetailTitleBar
      icon={<Shield size={14} style={{ color: 'var(--color-accent)' }} />}
      title={
        editMode ? (
          <Input
            {...updateForm.register('name')}
            error={updateForm.formState.errors.name?.message}
            className="max-w-[240px]"
          />
        ) : (
          fallbackAccLvName(accLv.name)
        )
      }
      actions={
        <CrudDetailActions
          editMode={editMode}
          isSaving={isUpdating}
          isDeleting={isDeleting}
          onEdit={onEditClick}
          onDelete={() => setDeleteModalOpen(true)}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      }
    />
  ) : (
    <div />
  )

  const drawerBody = !accLv ? (
    <div className="flex items-center justify-center min-h-[160px]">
      <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
        {t('access:selectRow')}
      </span>
    </div>
  ) : (
    <section>
      {accLv.description?.trim() ? (
        <DetailInfoField label={t('access:field.description')} className="mb-4">
          {accLv.description.trim()}
        </DetailInfoField>
      ) : null}

      <div className="flex items-center justify-between mb-2">
        <h2 className="app-text-md font-medium" style={{ color: 'var(--color-text)' }}>
          {t('access:readers.title')}
        </h2>
        {editMode ? (
          <Button
            variant="default"
            size="sm"
            onClick={() => setReaderEditOpen(true)}
            disabled={readerLoading}
          >
            {t('access:readers.change')}
          </Button>
        ) : null}
      </div>

      <div
        className="rounded overflow-hidden"
        style={{ border: '0.5px solid var(--color-border)' }}
      >
        <AccLvReaderTable rows={readerRows} loading={readerLoading} />
      </div>

      <p className="text-[13px] mt-2" style={{ color: 'var(--color-text-dim)' }}>
        {t('access:totalCount', { count: readerRows.length })}
      </p>
    </section>
  )

  return (
    <>
      <Drawer fill borderLeft={false} header={drawerHeader}>
        {drawerBody}
      </Drawer>

      <Modal
        open={deleteModalOpen}
        title={t('access:modal.deleteTitle')}
        description={t('access:modal.deleteDescription', { name: accLv?.name ?? '' })}
        confirmLabel={t('common:delete')}
        variant="danger"
        loading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModalOpen(false)}
      />

      {accLv ? (
        <AccLvReaderEditModal
          open={readerEditOpen}
          alvId={accLv.id}
          readers={readerList ?? []}
          scpNameMap={scpNameMap}
          onCancel={() => setReaderEditOpen(false)}
          onSaved={() => setReaderEditOpen(false)}
        />
      ) : null}
    </>
  )
}
