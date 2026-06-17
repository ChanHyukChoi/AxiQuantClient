import { useMemo } from 'react'
import { Cpu } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { Select } from '@/components/primitive/Select'
import {
  ALARM_EVENT_CODE_OPTIONS,
  getAlarmSoundOptions,
  getAlarmTimezoneOptions,
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
  const { t } = useTranslation(['alarm', 'common'])
  const { register, watch, setValue } = form
  const values = watch()

  const soundOptions = useMemo(() => getAlarmSoundOptions(t), [t])
  const timezoneOptions = useMemo(() => getAlarmTimezoneOptions(t), [t])

  const scpOptions = [
    { value: '0', label: t('alarm:select.placeholder') },
    ...scps.map((s) => ({ value: String(s.id), label: s.name })),
  ]

  if (!editMode) {
    const eventLabel =
      ALARM_EVENT_CODE_OPTIONS.find((o) => o.value === values.eventCode)?.label ??
      (values.eventCode || t('common:empty'))
    const scpLabel = values.scpId > 0 ? (scpNameMap[values.scpId] ?? t('common:empty')) : t('common:empty')
    const soundLabel =
      soundOptions.find((o) => o.value === values.alarmSound)?.label ?? t('common:empty')
    const tzLabel =
      timezoneOptions.find((o) => o.value === values.timezone)?.label ?? t('common:empty')

    const identity = (
      <>
        <InfoField label={t('alarm:field.name')}>
          <ReadOnlyValue>{values.name || t('common:empty')}</ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.eventCode')}>
          <ReadOnlyValue>{eventLabel}</ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.controller')}>
          <ReadOnlyValue>{scpLabel}</ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.device')}>
          <ReadOnlyValue>{deviceLabel || t('common:empty')}</ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.timezone')}>
          <ReadOnlyValue>{tzLabel}</ReadOnlyValue>
        </InfoField>
      </>
    )

    const settings = (
      <>
        <InfoField label={t('alarm:field.disabled')}>
          <ReadOnlyValue>
            {isAlarmActive(values.active) ? t('alarm:no') : t('alarm:yes')}
          </ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.monitoring')}>
          <ReadOnlyValue>{values.monitoring ? t('alarm:yes') : t('alarm:no')}</ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.ackRequired')}>
          <ReadOnlyValue>{values.ackRequired ? t('alarm:yes') : t('alarm:no')}</ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.alarmSound')}>
          <ReadOnlyValue>{soundLabel}</ReadOnlyValue>
        </InfoField>
        <InfoField label={t('alarm:field.alarmPriority')}>
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
      <InfoField label={t('alarm:field.name')}>
        <Input {...register('name')} />
      </InfoField>
      <InfoField label={t('alarm:field.eventCode')}>
        <Select
          value={values.eventCode}
          onChange={(v) => setValue('eventCode', v, { shouldDirty: true })}
          options={[
            { value: '', label: t('alarm:select.placeholder') },
            ...ALARM_EVENT_CODE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
      </InfoField>
      <InfoField label={t('alarm:field.controller')}>
        <Select
          value={String(values.scpId)}
          onChange={(v) => setValue('scpId', Number(v), { shouldDirty: true })}
          options={scpOptions}
        />
      </InfoField>
      <InfoField label={t('alarm:field.device')}>
        <div className="flex flex-col gap-1.5">
          <p className="text-[14px] truncate" style={{ color: 'var(--color-text-subtle)' }}>
            {deviceLabel || t('alarm:select.deviceNotSelected')}
          </p>
          <Button
            variant="default"
            size="sm"
            leftIcon={<Cpu size={12} />}
            onClick={onOpenDevicePicker}
          >
            {t('alarm:select.selectDevice')}
          </Button>
        </div>
      </InfoField>
      <InfoField label={t('alarm:field.timezone')}>
        <Select
          value={values.timezone}
          onChange={(v) => setValue('timezone', v, { shouldDirty: true })}
          options={timezoneOptions.map((o) => ({ value: o.value, label: o.label }))}
        />
      </InfoField>
    </>
  )

  const settingsEdit = (
    <>
      <InfoField label={t('alarm:field.disabled')}>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={!isAlarmActive(values.active)}
            onChange={(checked) =>
              setValue('active', checked ? 0 : 1, { shouldDirty: true })
            }
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            {t('alarm:field.disabled')}
          </span>
        </label>
      </InfoField>
      <InfoField label={t('alarm:field.monitoring')}>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={values.monitoring}
            onChange={(checked) => setValue('monitoring', checked, { shouldDirty: true })}
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            {t('alarm:field.monitoring')}
          </span>
        </label>
      </InfoField>
      <InfoField label={t('alarm:field.ackRequired')}>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={values.ackRequired}
            onChange={(checked) => setValue('ackRequired', checked, { shouldDirty: true })}
          />
          <span className="text-[14px]" style={{ color: 'var(--color-text)' }}>
            {t('alarm:field.ackRequired')}
          </span>
        </label>
      </InfoField>
      <InfoField label={t('alarm:field.alarmSound')}>
        <Select
          value={values.alarmSound}
          onChange={(v) => setValue('alarmSound', v, { shouldDirty: true })}
          options={soundOptions.map((o) => ({ value: o.value, label: o.label }))}
        />
      </InfoField>
      <InfoField label={t('alarm:field.alarmPriority')}>
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
