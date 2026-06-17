import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'
import {
  presetBtnStyle,
  toolbarDateInputClass,
} from '@/pages/EventMonitorPage/components/toolbarStyles'
import type { DatePreset } from '@/pages/EventMonitorPage/utils/dateRange'

interface MonitorDateRangeProps {
  datePreset: DatePreset
  onDatePresetChange: (p: DatePreset) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  trailing?: ReactNode
}

export const MonitorDateRange = ({
  datePreset,
  onDatePresetChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  trailing,
}: MonitorDateRangeProps) => {
  const { t } = useTranslation('eventMonitor')

  return (
    <div className="flex items-center gap-2 flex-wrap min-w-0">
      {(
        [
          ['today', t('datePreset.today')],
          ['7d', t('datePreset.7d')],
          ['30d', t('datePreset.30d')],
          ['180d', t('datePreset.180d')],
        ] as const
      ).map(([p, label]) => (
        <button
          key={p}
          type="button"
          style={presetBtnStyle(datePreset === p)}
          onClick={() => onDatePresetChange(p)}
        >
          {label}
        </button>
      ))}
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => {
          onDatePresetChange('custom')
          onDateFromChange(e.target.value)
        }}
        className={toolbarDateInputClass}
      />
      <span className="app-text-sm shrink-0" style={{ color: 'var(--color-text-dim)' }}>
        ~
      </span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => {
          onDatePresetChange('custom')
          onDateToChange(e.target.value)
        }}
        className={toolbarDateInputClass}
      />
      {trailing}
    </div>
  )
}
