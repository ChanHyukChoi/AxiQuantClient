import { useTranslation } from 'react-i18next'
import { Pause, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { ExportButton, PrintButton, SearchButton } from '@/components/page-actions'
import { MonitorDateRange } from '@/pages/EventMonitorPage/components/MonitorDateRange'
import { EventFilterButton } from '@/pages/EventMonitorPage/components/EventFilterButton'
import { MonitorTypePills } from '@/pages/EventMonitorPage/components/MonitorTypePills'
import {
  toolbarActionRowClass,
  toolbarDateRowClass,
  toolbarFilterRowClass,
  toolbarShellStyle,
} from '@/pages/EventMonitorPage/components/toolbarStyles'
import type { DatePreset } from '@/pages/EventMonitorPage/utils/dateRange'
import type { TypeFilter } from '@/pages/EventMonitorPage/utils/eventFilters'
import type { EventListFilters } from '@/pages/EventMonitorPage/components/EventFilterModal'

export type MonitorMode = 'live' | 'history'
export type { TypeFilter } from '@/pages/EventMonitorPage/utils/eventFilters'

interface MonitorToolbarProps {
  mode: MonitorMode
  onModeChange: (mode: MonitorMode) => void
  typeFilter: TypeFilter
  onTypeFilterChange: (f: TypeFilter) => void
  paused: boolean
  onTogglePause: () => void
  onClear: () => void
  isConnected: boolean
  datePreset: DatePreset
  onDatePresetChange: (p: DatePreset) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  onExport: () => void
  onPrint: () => void
  onSearch: () => void
  listFilters: EventListFilters
  onApplyFilters: (filters: EventListFilters) => void
}

const modeBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--color-btn-accent-bg)' : 'transparent',
  color: active ? 'var(--color-accent)' : 'var(--color-text-muted)',
  borderColor: active
    ? 'var(--color-btn-accent-border)'
    : 'var(--color-btn-default-border)',
})

export const MonitorToolbar = ({
  mode,
  onModeChange,
  typeFilter,
  onTypeFilterChange,
  paused,
  onTogglePause,
  onClear,
  isConnected,
  datePreset,
  onDatePresetChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onExport,
  onPrint,
  onSearch,
  listFilters,
  onApplyFilters,
}: MonitorToolbarProps) => {
  const { t } = useTranslation('eventMonitor')
  const receiving = mode === 'live' && isConnected && !paused

  return (
    <div className="flex flex-col flex-shrink-0" style={toolbarShellStyle}>
      <div className={toolbarActionRowClass}>
        <div className="flex items-center gap-1 shrink-0">
          <Button
            size="sm"
            style={modeBtnStyle(mode === 'live')}
            onClick={() => onModeChange('live')}
          >
            {t('mode.live')}
          </Button>
          <Button
            size="sm"
            style={modeBtnStyle(mode === 'history')}
            onClick={() => onModeChange('history')}
          >
            {t('mode.history')}
          </Button>
        </div>

        {mode === 'live' && (
          <div
            className="flex items-center gap-1.5 app-text-md shrink-0"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <span
              className="inline-block rounded-full"
              style={{
                width: 8,
                height: 8,
                background: receiving ? '#4caf7d' : 'var(--color-text-dim)',
                animation: receiving ? 'evt-pulse 1.2s ease-in-out infinite' : undefined,
              }}
            />
            {receiving
              ? t('status.receiving')
              : paused
                ? t('status.paused')
                : t('status.idle')}
          </div>
        )}

        <div className="flex items-center gap-1 ml-auto shrink-0">
          {mode === 'live' ? (
            <>
              <Button
                size="sm"
                variant="default"
                onClick={onTogglePause}
                leftIcon={paused ? <Play size={14} /> : <Pause size={14} />}
                title={paused ? t('status.resume') : t('status.pause')}
              />
              <Button
                size="sm"
                variant="default"
                onClick={onClear}
                leftIcon={<Trash2 size={14} />}
                title={t('status.clear')}
              />
            </>
          ) : (
            <>
              <ExportButton size="sm" showLabel={false} onClick={onExport} />
              <PrintButton size="sm" showLabel={false} onClick={onPrint} />
            </>
          )}
        </div>
      </div>

      <div className={toolbarFilterRowClass}>
        <MonitorTypePills typeFilter={typeFilter} onTypeFilterChange={onTypeFilterChange} />

        <div className="ml-auto shrink-0">
          <EventFilterButton scope={mode} filters={listFilters} onApplyFilters={onApplyFilters} />
        </div>
      </div>

      {mode === 'history' && (
        <div className={toolbarDateRowClass}>
          <MonitorDateRange
            datePreset={datePreset}
            onDatePresetChange={onDatePresetChange}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onDateFromChange={onDateFromChange}
            onDateToChange={onDateToChange}
            trailing={<SearchButton size="sm" onClick={onSearch} />}
          />
        </div>
      )}

      <style>{`@keyframes evt-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
    </div>
  )
}
