import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Bell, Check, Cpu, Pencil, Trash2, X } from 'lucide-react'
import { Drawer } from '@/components/ui/Drawer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { DevicePickerModal } from '@/pages/AlarmSettingsPage/components/DevicePickerModal'
import { alarmRuleSchema, type AlarmRuleFormValues } from '@/pages/AlarmSettingsPage/formTypes'
import {
  alarmToUpdatePayload,
  deviceDisplayLabel,
  isAlarmActive,
} from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import { useDeleteAlarm, useUpdateAlarm } from '@/hooks/useAlarmSettings'
import type { AlarmInfo } from '@/types/api'

interface AlarmRuleDrawerProps {
  alarm: AlarmInfo | null
  scpNameMap: Record<number, string>
  onDeleted: () => void
}

const alarmToForm = (alarm: AlarmInfo): AlarmRuleFormValues => ({
  name: alarm.name,
  active: alarm.active,
  deviceId: alarm.deviceId,
  deviceType: alarm.deviceType,
  eventCondition: alarm.eventCondition ?? '',
})

export const AlarmRuleDrawer = ({ alarm, scpNameMap, onDeleted }: AlarmRuleDrawerProps) => {
  const [editMode, setEditMode] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [devicePickerOpen, setDevicePickerOpen] = useState(false)
  const [deviceLabel, setDeviceLabel] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)

  const updateMut = useUpdateAlarm()
  const deleteMut = useDeleteAlarm()

  const { register, handleSubmit, reset, setValue, watch } = useForm<AlarmRuleFormValues>({
    resolver: zodResolver(alarmRuleSchema),
    defaultValues: {
      name: '',
      active: 1,
      deviceId: 0,
      deviceType: '',
      eventCondition: '',
    },
  })

  const active = watch('active')

  useEffect(() => {
    setEditMode(false)
    setSaveError(null)
    if (alarm) {
      reset(alarmToForm(alarm))
      setDeviceLabel(deviceDisplayLabel(alarm.deviceType, alarm.deviceId, scpNameMap))
    } else {
      setDeviceLabel('')
    }
  }, [alarm?.id, alarm, reset, scpNameMap])

  const handleEdit = () => {
    if (!alarm) return
    setSaveError(null)
    reset(alarmToForm(alarm))
    setEditMode(true)
  }

  const handleCancel = () => {
    if (!alarm) return
    setEditMode(false)
    setSaveError(null)
    reset(alarmToForm(alarm))
    setDeviceLabel(deviceDisplayLabel(alarm.deviceType, alarm.deviceId, scpNameMap))
  }

  const handleSave = handleSubmit(async (values) => {
    if (!alarm) return
    setSaveError(null)
    const ok = await updateMut.mutateAsync({
      id: alarm.id,
      data: { ...alarmToUpdatePayload(alarm), ...values },
    })
    if (ok) setEditMode(false)
    else setSaveError('저장하지 못했습니다.')
  })

  const handleDeleteConfirm = async () => {
    if (!alarm) return
    const ok = await deleteMut.mutateAsync(alarm.id)
    if (ok) {
      setDeleteOpen(false)
      onDeleted()
    }
  }

  const handleDevicePick = (deviceType: string, deviceId: number, label: string) => {
    setValue('deviceType', deviceType, { shouldDirty: true })
    setValue('deviceId', deviceId, { shouldDirty: true })
    setDeviceLabel(label)
    setDevicePickerOpen(false)
  }

  const drawerHeader = alarm ? (
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
        <Bell size={20} strokeWidth={1.6} />
      </div>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[15px] font-medium leading-tight truncate" style={{ color: 'var(--color-text)' }}>
          {alarm.name?.trim() || `경보 #${alarm.id}`}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
          {isAlarmActive(alarm.active) ? '활성' : '비활성'} · {deviceDisplayLabel(alarm.deviceType, alarm.deviceId, scpNameMap)}
        </span>
      </div>
    </div>
  ) : (
    <div className="pb-3 text-[12px]" style={{ color: 'var(--color-text-subtle)' }}>
      좌측 목록에서 경보를 선택하세요.
    </div>
  )

  const drawerActions = alarm ? (
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
            저장
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
          삭제
        </Button>
        <Button variant="accent" size="sm" leftIcon={<Pencil size={12} />} onClick={handleEdit}>
          수정
        </Button>
      </>
    )
  ) : undefined

  return (
  <>
    <Drawer fill header={drawerHeader} actions={drawerActions}>
      {alarm && editMode ? (
        <div className="flex flex-col gap-4">
          <Field label="명칭">
            <Input {...register('name')} />
          </Field>

          <Field label="활성">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAlarmActive(active)}
                onChange={(e) => setValue('active', e.target.checked ? 1 : 0)}
              />
              <span className="text-[12px]" style={{ color: 'var(--color-text)' }}>
                {isAlarmActive(active) ? '활성' : '비활성'}
              </span>
            </label>
          </Field>

          <Field label="연결 장치">
            <div className="flex flex-col gap-2">
              <p className="text-[12px] truncate" style={{ color: 'var(--color-text-subtle)' }}>
                {deviceLabel || '미선택'}
              </p>
              <Button
                variant="default"
                size="sm"
                leftIcon={<Cpu size={12} />}
                onClick={() => setDevicePickerOpen(true)}
              >
                장치 선택
              </Button>
            </div>
          </Field>

          <Field label="이벤트 조건">
            <textarea
              {...register('eventCondition')}
              rows={5}
              className="w-full text-[12px] px-2 py-1 rounded border outline-none resize-y"
              style={{
                background: 'var(--color-input-bg)',
                color: 'var(--color-text)',
                borderColor: 'var(--color-input-border)',
              }}
              placeholder="이벤트 조건을 입력하세요"
            />
          </Field>
        </div>
      ) : alarm ? (
        <AlarmReadOnly alarm={alarm} scpNameMap={scpNameMap} />
      ) : null}
    </Drawer>

    <DevicePickerModal
      open={devicePickerOpen}
      onCancel={() => setDevicePickerOpen(false)}
      onConfirm={handleDevicePick}
    />

    <Modal
      open={deleteOpen}
      title="경보 삭제"
      description={`「${alarm?.name ?? ''}」 경보를 삭제하시겠습니까?`}
      confirmLabel="삭제"
      loading={deleteMut.isPending}
      onConfirm={handleDeleteConfirm}
      onCancel={() => setDeleteOpen(false)}
    />
  </>
  )
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

const AlarmReadOnly = ({
  alarm,
  scpNameMap,
}: {
  alarm: AlarmInfo
  scpNameMap: Record<number, string>
}) => (
  <div className="flex flex-col gap-3 text-[12px]" style={{ color: 'var(--color-text-muted)' }}>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>활성: </span>
      {isAlarmActive(alarm.active) ? '예' : '아니오'}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>장치: </span>
      {deviceDisplayLabel(alarm.deviceType, alarm.deviceId, scpNameMap)}
    </p>
    <p>
      <span style={{ color: 'var(--color-text-subtle)' }}>이벤트 조건: </span>
      {alarm.eventCondition?.trim() || '—'}
    </p>
  </div>
)
