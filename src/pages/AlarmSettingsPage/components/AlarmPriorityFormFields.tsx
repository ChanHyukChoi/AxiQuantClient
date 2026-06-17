import { useMemo } from 'react'
import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/primitive/Button'
import { Checkbox } from '@/components/primitive/Checkbox'
import { Input } from '@/components/primitive/Input'
import { Select } from '@/components/primitive/Select'
import { getPriorityBlinkOptions } from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import { getAlarmSoundOptions } from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import { AlarmPrioritySamplePreview } from '@/pages/AlarmSettingsPage/components/AlarmPrioritySamplePreview'
import type { AlarmPriorityFormValues } from '@/pages/AlarmSettingsPage/formTypes'
import { normalizeHexColor } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import { blinkingLabel } from '@/pages/AlarmSettingsPage/components/AlarmPrioritySamplePreview'

interface AlarmPriorityFormFieldsProps {
  form: UseFormReturn<AlarmPriorityFormValues>
  editMode: boolean
  layout?: 'stack' | 'wpf'
}

const InfoField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <span className="text-[13px] block mb-0.5" style={{ color: 'var(--color-text-subtle)' }}>
      {label}
    </span>
    {children}
  </div>
)

const ColorField = ({
  label,
  color,
  bgEnabled,
  showBgToggle,
  editMode,
  onColorChange,
  onBgToggle,
}: {
  label: string
  color: string
  bgEnabled?: boolean
  showBgToggle?: boolean
  editMode: boolean
  onColorChange: (hex: string) => void
  onBgToggle?: (enabled: boolean) => void
}) => {
  const { t } = useTranslation('alarm')
  const hex = normalizeHexColor(color)
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[13px]" style={{ color: 'var(--color-text-subtle)' }}>
        {label}
      </span>
      {editMode ? (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="color"
            value={hex}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-9 h-7 cursor-pointer border-0 p-0 bg-transparent"
            aria-label={label}
          />
          <Input
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="#RRGGBB"
            className="max-w-[100px]"
          />
          {showBgToggle && onBgToggle != null ? (
            <label className="flex items-center gap-1.5 cursor-pointer">
              <Checkbox checked={bgEnabled ?? false} onChange={onBgToggle} />
              <span className="text-[13px]" style={{ color: 'var(--color-text-muted)' }}>
                {t('field.bgColor')}
              </span>
            </label>
          ) : null}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded" style={{ background: hex }} />
          <span className="text-[13px] font-mono" style={{ color: 'var(--color-text)' }}>
            {hex}
          </span>
        </div>
      )}
    </div>
  )
}

const StyleSection = ({
  title,
  form,
  editMode,
  fgKey,
  bgKey,
  bgEnabledKey,
  showBlinking,
}: {
  title: string
  form: UseFormReturn<AlarmPriorityFormValues>
  editMode: boolean
  fgKey: 'alarmFg' | 'ackFg'
  bgKey: 'alarmBg' | 'ackBg'
  bgEnabledKey: 'alarmBgEnabled' | 'ackBgEnabled'
  showBlinking?: boolean
}) => {
  const { t } = useTranslation('alarm')
  const { watch, setValue } = form
  const values = watch()
  const fg = values[fgKey]
  const bg = values[bgKey]
  const bgEnabled = values[bgEnabledKey]

  return (
    <div
      className="flex flex-col gap-2 p-3 rounded"
      style={{
        border: '0.5px solid var(--color-border)',
        background: 'var(--color-btn-hover)',
      }}
    >
      <span className="text-[13px] font-medium" style={{ color: 'var(--color-text)' }}>
        {title}
      </span>
      <AlarmPrioritySamplePreview
        fgColor={normalizeHexColor(fg)}
        bgColor={normalizeHexColor(bg)}
        bgEnabled={bgEnabled}
        blinking={showBlinking ? values.blinking : 'off'}
      />
      <ColorField
        label={t('field.textColor')}
        color={fg}
        editMode={editMode}
        onColorChange={(v) => setValue(fgKey, v, { shouldDirty: true })}
      />
      <ColorField
        label={t('field.bgColor')}
        color={bg}
        bgEnabled={bgEnabled}
        showBgToggle
        editMode={editMode}
        onColorChange={(v) => setValue(bgKey, v, { shouldDirty: true })}
        onBgToggle={(checked) => setValue(bgEnabledKey, checked, { shouldDirty: true })}
      />
    </div>
  )
}

export const AlarmPriorityFormFields = ({
  form,
  editMode,
  layout = 'stack',
}: AlarmPriorityFormFieldsProps) => {
  const { t } = useTranslation(['alarm', 'common'])
  const { register, watch, setValue } = form
  const values = watch()

  const blinkOptions = useMemo(() => getPriorityBlinkOptions(t), [t])
  const soundOptions = useMemo(() => getAlarmSoundOptions(t), [t])

  const priorityField = (
    <InfoField label={t('alarm:field.priority')}>
      {editMode ? (
        <div className="flex flex-col gap-0.5 max-w-[120px]">
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
      ) : (
        <span className="text-[15px] font-mono" style={{ color: 'var(--color-text)' }}>
          {values.priority}
        </span>
      )}
    </InfoField>
  )

  const alarmSection = (
    <StyleSection
      title={t('alarm:priority.onAlarm')}
      form={form}
      editMode={editMode}
      fgKey="alarmFg"
      bgKey="alarmBg"
      bgEnabledKey="alarmBgEnabled"
      showBlinking
    />
  )

  const ackSection = (
    <StyleSection
      title={t('alarm:field.afterAck')}
      form={form}
      editMode={editMode}
      fgKey="ackFg"
      bgKey="ackBg"
      bgEnabledKey="ackBgEnabled"
    />
  )

  const extras = editMode ? (
    <div className="flex flex-col gap-3">
      <InfoField label={t('alarm:field.blinking')}>
        <Select
          value={values.blinking}
          onChange={(v) => setValue('blinking', v, { shouldDirty: true })}
          options={blinkOptions.map((o) => ({ value: o.value, label: o.label }))}
        />
      </InfoField>
      <InfoField label={t('alarm:field.sound')}>
        <div className="flex items-center gap-2">
          <Select
            value={values.alarmSound}
            onChange={(v) => setValue('alarmSound', v, { shouldDirty: true })}
            options={soundOptions.map((o) => ({ value: o.value, label: o.label }))}
            className="flex-1"
          />
          <Button variant="default" size="sm" title={t('alarm:previewListen')} disabled>
            <Volume2 size={14} />
          </Button>
        </div>
      </InfoField>
    </div>
  ) : (
    <div className="flex flex-col gap-2 text-[14px]" style={{ color: 'var(--color-text-muted)' }}>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.blinking')}: </span>
        {blinkingLabel(values.blinking)}
      </p>
      <p>
        <span style={{ color: 'var(--color-text-subtle)' }}>{t('alarm:field.sound')}: </span>
        {soundOptions.find((o) => o.value === values.alarmSound)?.label ?? t('common:empty')}
      </p>
    </div>
  )

  if (layout === 'wpf') {
    return (
      <div className="flex gap-4 min-h-0">
        <div className="flex-shrink-0 pt-1">{priorityField}</div>
        <div className="flex-1 grid grid-cols-2 gap-3 min-w-0">
          {alarmSection}
          {ackSection}
        </div>
        <div className="flex-shrink-0 w-[160px]">{extras}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {priorityField}
      {alarmSection}
      {ackSection}
      {extras}
    </div>
  )
}
