import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, Check, Mail, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/primitive/Drawer'
import { Button } from '@/components/primitive/Button'
import { Input } from '@/components/primitive/Input'
import { Modal } from '@/components/primitive/Modal'
import { AlarmSelectModal } from '@/pages/AlarmSettingsPage/components/AlarmSelectModal'
import {
  alarmMailSchema,
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
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [alarmSelectOpen, setAlarmSelectOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateMut = useUpdateAlarmMail()
  const deleteMut = useDeleteAlarmMail()

  const { register, handleSubmit, reset, setValue, watch } = useForm<AlarmMailFormValues>(
    {
      resolver: zodResolver(alarmMailSchema),
      defaultValues: { name: '', alarmIds: [], emails: [''] },
    },
  )

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
    else setSaveError('\uc800\uc7a5\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4.')
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
          {item.name?.trim() || '이메일 경보'}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
          {'\uacbd\ubcf4 '}
          {item.alarmIds?.length ?? 0}
          {' \u00b7 \uc218\uc2e0\uc790 '}
          {item.emails?.length ?? 0}
        </span>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
      {
        '\uc88c\uce21 \ubaa9\ub85d\uc5d0\uc11c \uc774\uba54\uc77c \uacbd\ubcf4\ub97c \uc120\ud0dd\ud558\uc138\uc694.'
      }
    </div>
  )

  const drawerActions = item ? (
    editMode ? (
      <div className="flex flex-col items-stretch gap-2 w-full max-w-[260px] ml-auto">
        {saveError ? (
          <p className="text-[11px] text-right" style={{ color: '#c75c5c' }}>
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
            {'\ucde8\uc18c'}
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={updateMut.isPending}
            onClick={handleSave}
          >
            {'\uc800\uc7a5'}
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
          {'\uc0ad\uc81c'}
        </Button>
        <Button
          variant="accent"
          size="sm"
          leftIcon={<Pencil size={12} />}
          onClick={handleEdit}
        >
          {'\uc218\uc815'}
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
                className="text-[11px] font-medium"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                {'\uba85\uce6d'}
              </span>
              <Input {...register('name')} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {'\uc5f0\uacb0 \uacbd\ubcf4'}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  leftIcon={<Bell size={12} />}
                  onClick={() => setAlarmSelectOpen(true)}
                >
                  {'\uacbd\ubcf4 \uc120\ud0dd'}
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {alarmIds.length === 0 ? (
                  <span
                    className="text-[11px]"
                    style={{ color: 'var(--color-text-dim)' }}
                  >
                    {'\uc120\ud0dd\ub41c \uacbd\ubcf4 \uc5c6\uc74c'}
                  </span>
                ) : (
                  alarmIds.map((id) => (
                    <span
                      key={id}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full"
                      style={{
                        background: 'var(--color-btn-hover)',
                        color: 'var(--color-text)',
                        border: '0.5px solid var(--color-border)',
                      }}
                    >
                      {alarmNameMap[id] ?? '경보'}
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
                  className="text-[11px] font-medium"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {'\uc218\uc2e0 \uc774\uba54\uc77c'}
                </span>
                <Button
                  variant="default"
                  size="sm"
                  leftIcon={<Plus size={12} />}
                  onClick={addEmailRow}
                >
                  {'\ucd94\uac00'}
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
            className="flex flex-col gap-3 text-[12px]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <p>
              <span style={{ color: 'var(--color-text-subtle)' }}>
                {'\uc5f0\uacb0 \uacbd\ubcf4: '}
              </span>
              {(item.alarmIds ?? []).length === 0
                ? '\u2014'
                : (item.alarmIds ?? [])
                    .map((id) => alarmNameMap[id] ?? '경보')
                    .join(', ')}
            </p>
            <p>
              <span style={{ color: 'var(--color-text-subtle)' }}>
                {'\uc218\uc2e0\uc790: '}
              </span>
              {(item.emails ?? []).length === 0
                ? '\u2014'
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
        title={'\uc774\uba54\uc77c \uacbd\ubcf4 \uc0ad\uc81c'}
        description={`\u300c${item?.name ?? ''}\u300d \ud56d\ubaa9\uc744 \uc0ad\uc81c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?`}
        confirmLabel={'\uc0ad\uc81c'}
        loading={deleteMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
