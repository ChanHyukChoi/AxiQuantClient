import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, Check, Mail, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { AlarmSelectModal } from '@/pages/AlarmSettingsPage/components/AlarmSelectModal'
import {
  createAlarmMailSchema,
  type AlarmMailFormValues,
} from '@/pages/AlarmSettingsPage/formTypes'
import { mailToUpdatePayload } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import { useDeleteAlarmMail, useUpdateAlarmMail } from '@/hooks/api/useAlarmSettings'
import type { AlarmInfo, AlarmMailInfo } from '@/types/api'

interface AlarmMailDrawerProps {
  item: AlarmMailInfo | null
  alarms: AlarmInfo[]
  alarmNameMap: Record<number, string>
  onDeleted: () => void
}

const toForm = (item: AlarmMailInfo): AlarmMailFormValues => ({
  name: item.name,
  alarmIds: item.alarmIds ?? [],
  emails: item.emails?.length ? item.emails : [''],
})

export const AlarmMailDrawer = ({
  item,
  alarms,
  alarmNameMap,
  onDeleted,
}: AlarmMailDrawerProps) => {
  const { t } = useTranslation(['alarm', 'common'])
  const alarmMailSchema = useMemo(() => createAlarmMailSchema(t), [t])
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [alarmSelectOpen, setAlarmSelectOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateMut = useUpdateAlarmMail()
  const deleteMut = useDeleteAlarmMail()

  const { register, handleSubmit, reset, setValue, watch } = useForm<AlarmMailFormValues>({
    resolver: zodResolver(alarmMailSchema),
    defaultValues: { name: '', alarmIds: [], emails: [''] },
  })

  const alarmIds = watch('alarmIds')
  const emails = watch('emails')

  useEffect(() => {
    setEditMode(false)
    setSaveError(null)
    if (item) reset(toForm(item))
  }, [item?.id, item, reset])

  const handleEdit = () => {
    if (!item) return
    setSaveError(null)
    reset(toForm(item))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (!item) return
    setEditMode(false)
    setSaveError(null)
    reset(toForm(item))
  }

  const handleSave = handleSubmit(async (values) => {
    if (!item) return
    setSaveError(null)
    const ok = await updateMut.mutateAsync({
      id: item.id,
      data: {
        ...mailToUpdatePayload(item),
        ...values,
        emails: values.emails.filter((e) => e.trim() !== ''),
      },
    })
    if (ok) setEditMode(false)
    else setSaveError(t('alarm:error.saveFailed'))
  })

  const handleDeleteConfirm = async () => {
    if (!item) return
    const ok = await deleteMut.mutateAsync(item.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    }
  }

  const removeAlarmId = (id: number) => {
    setValue(
      'alarmIds',
      alarmIds.filter((x) => x !== id),
      { shouldDirty: true },
    )
  }

  const addEmailRow = () => {
    setValue('emails', [...emails, ''], { shouldDirty: true })
  }

  const updateEmail = (index: number, value: string) => {
    const next = [...emails]
    next[index] = value
    setValue('emails', next, { shouldDirty: true })
  }

  const removeEmail = (index: number) => {
    const next = emails.filter((_, i) => i !== index)
    setValue('emails', next.length ? next : [''], { shouldDirty: true })
  }

  const drawerHeader = item ? (
    <div
      className="flex items-start gap-3 pb-3"
      style={{ borderBottom: '0.5px solid var(--color-border)' }}
    >
      <div
        className="flex items-center justify-center rounded-md flex-shrink-0"
        style={{
          width: 40,
          height: 40,
          background: 'var(--color-btn-hover)',
          color: 'var(--color-accent)',
        }}
      >
        <Mail size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span
          className="text-[15px] font-medium truncate"
          style={{ color: 'var(--color-text)' }}
        >
          {item.name?.trim() || t('alarm:mail.fallback')}
        </span>
        <span className="text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
          {t('alarm:mail.summary', {
            alarmCount: item.alarmIds?.length ?? 0,
            emailCount: item.emails?.length ?? 0,
          })}
        </span>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[14px]" style={{ color: 'var(--color-text-subtle)' }}>
      {t('alarm:mail.selectItem')}
    </div>
  )

  const drawerActions = item ? (
    editMode ? (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
        {saveError ? (
          <p className="text-[13px] text-right" style={{ color: '#c75c5c' }}>
            {saveError}
          </p>
        ) : null}
        <div className="flex justify-end gap-1.5">
          <Button
            variant="default"
            size="sm"
            leftIcon={<X size={12} />}
            onClick={handleCancel}
          >
            {t('common:cancel')}
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={updateMut.isPending}
            onClick={handleSave}
          >
            {t('common:save')}
          </Button>
        </div>
      </div>
    ) : (
      <>
        <Button
          variant="danger"
          size="sm"
          leftIcon={<Trash2 size={12} />}
          onClick={() => setDeleteOpen(true)}
        >
          {t('common:delete')}
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={handleEdit}
        >
          {t('common:edit')}
        </Button>
      </>
    )
  ) : undefined

  return (
    <>
      <Drawer fill header={drawerHeader} actions={drawerActions}>
        {item && editMode ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span
                className="text-[13px] font-medium"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                {t('alarm:field.name')}
              </span>
              <Input {...register('name')} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] font-medium"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {t('alarm:mail.connectedAlarms')}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  leftIcon={<Bell size={12} />}
                  onClick={() => setAlarmSelectOpen(true)}
                >
                  {t('alarm:select.alarmSelectTitle')}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alarmIds.length === 0 ? (
                  <span
                    className="text-[13px]"
                    style={{ color: 'var(--color-text-dim)' }}
                  >
                    {t('alarm:mail.noAlarmsSelected')}
                  </span>
                ) : (
                  alarmIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 text-[13px] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--color-btn-hover)',
                        color: 'var(--color-text)',
                        border: '0.5px solid var(--color-border)',
                      }}
                    >
                      {alarmNameMap[id] ?? t('alarm:rule.fallback')}
                      <button
                        type="button"
                        className="cursor-pointer"
                        onClick={() => removeAlarmId(id)}
                        style={{ color: 'var(--color-icon)' }}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-[13px] font-medium"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {t('alarm:mail.recipientEmails')}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  leftIcon={<Plus size={12} />}
                  onClick={addEmailRow}
                >
                  {t('common:add')}
                </Button>
              </div>
              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <Input
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="email@example.com"
                  />
                  <Button variant="default" size="sm" onClick={() => removeEmail(index)}>
                    <X size={12} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : item ? (
          <div
            className="flex flex-col gap-3 text-[14px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <p>
              <span style={{ color: 'var(--color-text-subtle)' }}>
                {t('alarm:mail.connectedAlarms')}:{' '}
              </span>
              {(item.alarmIds ?? []).length === 0
                ? t('common:empty')
                : (item.alarmIds ?? [])
                    .map((id) => alarmNameMap[id] ?? t('alarm:rule.fallback'))
                    .join(', ')}
            </p>
            <p>
              <span style={{ color: 'var(--color-text-subtle)' }}>
                {t('alarm:mail.recipients')}:{' '}
              </span>
              {(item.emails ?? []).length === 0
                ? t('common:empty')
                : (item.emails ?? []).join(', ')}
            </p>
          </div>
        ) : null}
      </Drawer>

      <AlarmSelectModal
        open={alarmSelectOpen}
        alarms={alarms}
        selectedIds={alarmIds}
        onCancel={() => setAlarmSelectOpen(false)}
        onConfirm={(ids) => {
          setValue('alarmIds', ids, { shouldDirty: true })
          setAlarmSelectOpen(false)
        }}
      />

      <Modal
        open={deleteOpen}
        title={t('alarm:mail.modal.deleteTitle')}
        description={t('alarm:mail.modal.deleteDescription', { name: item?.name ?? '' })}
        confirmLabel={t('common:delete')}
        loading={deleteMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
