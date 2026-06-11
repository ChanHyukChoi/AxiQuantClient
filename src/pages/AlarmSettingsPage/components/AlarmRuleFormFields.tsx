import { Cpu } from 'lucide-react'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { Select } from '@/components/primitive/Select'
import {
  ALARM_EVENT_CODE_OPTIONS,
  ALARM_SOUND_OPTIONS,
  ALARM_TIMEZONE_OPTIONS,
} from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import type { AlarmRuleFormValues } from '@/pages/AlarmSettingsPage/formTypes'
import { isAlarmActive } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import type { ScpInfo } from '@/types/api'

interface AlarmRuleFormFieldsProps {
  form: UseFormReturn<AlarmRuleFormValues>
  editMode: boolean
  scps: ScpInfo[]
  scpNameMap: Record<number, string>
  deviceLabel: string
  onOpenDevicePicker: () => void
  layout?: 'stack' | 'columns'
}

const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <span className="text-[13px] block mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

const ReadOnlyValue = ({ children }: { children: React.ReactNode }) => (
  <span className="text-[15px]" style={{ color: 'var(--color-text)' }}>
    {children}
  </span>
)

export const AlarmRuleFormFields = ({
  form,
  editMode,
  scps,
  scpNameMap,
  deviceLabel,
  onOpenDevicePicker,
  layout = 'stack',
}: AlarmRuleFormFieldsProps) => {
  const { register, watch, setValue } = form
  const values = watch()

  const scpOptions = [
    { value: '0', label: '선택...' },
    ...scps.map((s) => ({ value: String(s.id), label: s.name })),
  ]

  if (!editMode) {
    const eventLabel =
      ALARM_EVENT_CODE_OPTIONS.find((o) => o.value === values.eventCode)?.label ??
      (values.eventCode || '—')
    const scpLabel = values.scpId > 0 ? (scpNameMap[values.scpId] ?? '—') : '—'
    const soundLabel =
      ALARM_SOUND_OPTIONS.find((o) => o.value === values.alarmSound)?.label ?? '—'
    const tzLabel =
      ALARM_TIMEZONE_OPTIONS.find((o) => o.value === values.timezone)?.label ?? '—'

    const identity = (
      <>
        <InfoField label="명칭">
          <ReadOnlyValue>{values.name || '—'}</ReadOnlyValue>
        </InfoField>
        <InfoField label="경보 코드">
          <ReadOnlyValue>{eventLabel}</ReadOnlyValue>
        </InfoField>
        <InfoField label="컨트롤러">
          <ReadOnlyValue>{scpLabel}</ReadOnlyValue>
        </InfoField>
        <InfoField label="장치">
          <ReadOnlyValue>{deviceLabel || '—'}</ReadOnlyValue>
        </InfoField>
        <InfoField label="타임존">
          <ReadOnlyValue>{tzLabel}</ReadOnlyValue>
        </InfoField>
      </>
    )

    const settings = (
      <>
        <InfoField label="사용 안함">
          <ReadOnlyValue>{isAlarmActive(values.active) ? '아니오' : '예'}</ReadOnlyValue>
        </InfoField>
        <InfoField label="모니터링">
          <ReadOnlyValue>{values.monitoring ? '예' : '아니오'}</ReadOnlyValue>
        </InfoField>
        <InfoField label="인지 필요">
          <ReadOnlyValue>{values.ackRequired ? '예' : '아니오'}</ReadOnlyValue>
        </InfoField>
        <InfoField label="경보음">
          <ReadOnlyValue>{soundLabel}</ReadOnlyValue>
        </InfoField>
        <InfoField label="경보 우선순위">
          <ReadOnlyValue>{values.priority}</ReadOnlyValue>
        </InfoField>
      </>
    )

    if (layout === 'columns') {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-3">{identity}</div>
          <div className="flex flex-col gap-3">{settings}</div>
        </div>
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {identity}
        {settings}
      </div>
    )
  }

  const identityEdit = (
    <>
      <InfoField label="명칭">
        <Input {...register('name')} />
      </InfoField>
      <InfoField label="경보 코드">
        <Select
          value={values.eventCode}
          onChange={(v) => setValue('eventCode', v, { shouldDirty: true })}
          options={[
            { value: '', label: '선택...' },
            ...ALARM_EVENT_CODE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
      </InfoField>
      <InfoField label="컨트롤러">
        <Select
          value={String(values.scpId)}
          onChange={(v) => setValue('scpId', Number(v), { shouldDirty: true })}
          options={scpOptions}
        />
      </InfoField>
      <InfoField label="장치">
        <div className="flex flex-col gap-1.5">
          <p className="text-[14px] truncate" style={{ color: 'var(--color-text-subtle)' }}>
            {deviceLabel || '미선택'}
          </p>
          <Button
            variant="default"
            size="sm"
            leftIcon={<Cpu size={12} />}
            onClick={onOpenDevicePicker}
          >
            장치 선택
          </Button>
        </div>
      </InfoField>
      <InfoField label="타임존">
        <Select
          value={values.timezone}
          onChange={(v) => setValue('timezone', v, { shouldDirty: true })}
          options={ALARM_TIMEZONE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </InfoField>
    </>
  )

  const settingsEdit = (
    <>
      <InfoField label="사용 안함">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={!isAlarmActive(values.active)}
            onChange={(checked) =>
              setValue('active', checked ? 0 : 1, { shouldDirty: true })
            }
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            사용 안함
          </span>
        </label>
      </InfoField>
      <InfoField label="모니터링">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={values.monitoring}
            onChange={(checked) => setValue('monitoring', checked, { shouldDirty: true })}
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            모니터링
          </span>
        </label>
      </InfoField>
      <InfoField label="인지 필요">
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={values.ackRequired}
            onChange={(checked) => setValue('ackRequired', checked, { shouldDirty: true })}
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            인지 필요
          </span>
        </label>
      </InfoField>
      <InfoField label="경보음">
        <Select
          value={values.alarmSound}
          onChange={(v) => setValue('alarmSound', v, { shouldDirty: true })}
          options={ALARM_SOUND_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
        />
      </InfoField>
      <InfoField label="경보 우선순위">
        <div className="flex flex-col gap-0.5">
          <Input
            type="number"
            min={1}
            max={100}
            {...register('priority', { valueAsNumber: true })}
          />
          <span className="text-[12px]" style={{ color: 'var(--color-text-dim)' }}>
            (1–100)
          </span>
        </div>
      </InfoField>
    </>
  )

  if (layout === 'columns') {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">{identityEdit}</div>
        <div className="flex flex-col gap-3">{settingsEdit}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {identityEdit}
      {settingsEdit}
    </div>
  )
}
