import i18n from '@/lib/i18n'
import { getPriorityBlinkOptions } from '@/pages/AlarmSettingsPage/alarmPriorityTypes'

interface AlarmPrioritySamplePreviewProps {
  fgColor: string
  bgColor: string
  bgEnabled: boolean
  blinking?: string
  compact?: boolean
}

export const AlarmPrioritySamplePreview = ({
  fgColor,
  bgColor,
  bgEnabled,
  blinking = 'off',
  compact = false,
}: AlarmPrioritySamplePreviewProps) => {
  const blinkClass =
    blinking === 'fast'
      ? 'animate-pulse'
      : blinking === 'slow'
        ? 'opacity-80'
        : ''

  return (
    <div
      className={`inline-flex items-center justify-center rounded ${blinkClass}`}
      style={{
        minWidth: compact ? 72 : 120,
        minHeight: compact ? 24 : 32,
        padding: compact ? '2px 10px' : '4px 16px',
        color: fgColor,
        background: bgEnabled ? bgColor : 'transparent',
        border: bgEnabled ? 'none' : `0.5px solid var(--color-border)`,
      }}
    >
      <span className={compact ? 'text-[13px]' : 'text-[14px]'}>Sample</span>
    </div>
  )
}

export const blinkingLabel = (value: string): string => {
  const t = i18n.getFixedT(null, 'alarm')
  return getPriorityBlinkOptions(t).find((o) => o.value === value)?.label ?? value
}
