import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Pencil, Star, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { alarmPrioritySchema, type AlarmPriorityFormValues } from '@/pages/AlarmSettingsPage/formTypes'
import { normalizeHexColor, priorityToUpdatePayload } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import { useDeleteAlarmPriority, useUpdateAlarmPriority } from '@/hooks/useAlarmSettings'
import type { AlarmPriorityInfo } from '@/types/api'

interface AlarmPriorityDrawerProps {
  item: AlarmPriorityInfo | null
  onDeleted: () => void
}

const toForm = (item: AlarmPriorityInfo): AlarmPriorityFormValues => ({
  priority: item.priority,
  color: normalizeHexColor(item.color),
})

export const AlarmPriorityDrawer = ({ item, onDeleted }: AlarmPriorityDrawerProps) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateMut = useUpdateAlarmPriority()
  const deleteMut = useDeleteAlarmPriority()

  const { register, handleSubmit, reset, setValue, watch } = useForm<AlarmPriorityFormValues>({
    resolver: zodResolver(alarmPrioritySchema),
    defaultValues: { priority: 0, color: '#4f9cf9' },
  })

  const color = watch('color')

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
      data: { ...priorityToUpdatePayload(item), ...values, color: normalizeHexColor(values.color) },
    })
    if (ok) setEditMode(false)
    else setSaveError('?�?�하지 못했?�니??')
  })

  const handleDeleteConfirm = async () => {
    if (!item) return
    const ok = await deleteMut.mutateAsync(item.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    }
  }

  const hex = normalizeHexColor(color ?? item?.color ?? '#4f9cf9')

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
        <Star size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-medium" style={{ color: 'var(--color-text)' }}>
          ?�선?�위 {item.priority}
        </span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ background: hex }} />
          <span className="text-[12px] font-mono" style={{ color: 'var(--color-text-subtle)' }}>
            {hex}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
      좌측 목록?�서 ?�선?�위�??�택?�세??
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
          <Button variant="default" size="sm" leftIcon={<X size={12} />} onClick={handleCancel}>
            취소
          </Button>
          <Button
            variant="accent"
            size="sm"
            leftIcon={<Check size={12} />}
            loading={updateMut.isPending}
            onClick={handleSave}
          >
            ?�??
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
          ??��
        </Button>
        <Button variant="accent" size="sm" leftIcon={<Pencil size={12} />} onClick={handleEdit}>
          ?�정
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
              <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-subtle)' }}>
                ?�선?�위
              </span>
              <Input type="number" {...register('priority', { valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-subtle)' }}>
                ?�상
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setValue('color', e.target.value, { shouldDirty: true })}
                  className="w-10 h-8 cursor-pointer border-0 p-0 bg-transparent"
                />
                <Input
                  value={color}
                  onChange={(e) => setValue('color', e.target.value, { shouldDirty: true })}
                  placeholder="#RRGGBB"
                />
              </div>
            </div>
          </div>
        ) : item ? (
          <div className="flex flex-col gap-3 text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
            <p>
              <span style={{ color: 'var(--color-text-subtle)' }}>?�선?�위: </span>
              {item.priority}
            </p>
            <div className="flex items-center gap-2">
              <span style={{ color: 'var(--color-text-subtle)' }}>?�상: </span>
              <span className="w-4 h-4 rounded-full" style={{ background: normalizeHexColor(item.color) }} />
              <span className="font-mono">{normalizeHexColor(item.color)}</span>
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        open={deleteOpen}
        title="?�선?�위 ??��"
        description={`?�선?�위 ${item?.priority ?? ''} ??��????��?�시겠습?�까?`}
        confirmLabel="??��"
        loading={deleteMut.isPending}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  )
}
