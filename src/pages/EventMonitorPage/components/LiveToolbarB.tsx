import { useTranslation } from 'react-i18next'
import { Pause, Play, Trash2 } from 'lucide-react'
import { Button } from '@/components/primitive/Button'
import { EventFilterButton } from '@/pages/EventMonitorPage/components/EventFilterButton'
import { MonitorTypePills } from '@/pages/EventMonitorPage/components/MonitorTypePills'
import {
  toolbarActionRowClass,
  toolbarFilterRowClass,
  toolbarShellStyle,
} from '@/pages/EventMonitorPage/components/toolbarStyles'
import type { EventListFilters } from '@/pages/EventMonitorPage/components/EventFilterModal'
import type { TypeFilter } from '@/pages/EventMonitorPage/utils/eventFilters'

interface LiveToolbarBProps {
  typeFilter: TypeFilter
  onTypeFilterChange: (f: TypeFilter) => void
  paused: boolean
  onTogglePause: () => void
  onClear: () => void
  isConnected: boolean
  listFilters: EventListFilters
  onApplyFilters: (filters: EventListFilters) => void
}

export const LiveToolbarB = ({
  typeFilter,
  onTypeFilterChange,
  paused,
  onTogglePause,
  onClear,
  isConnected,
  listFilters,
  onApplyFilters,
}: LiveToolbarBProps) => {
  const { t } = useTranslation('eventMonitor')
  const receiving = isConnected && !paused

  return (
    <div className="flex flex-col flex-shrink-0" style={toolbarShellStyle}>
      <div className={toolbarActionRowClass}>
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

        <div className="flex items-center gap-1 ml-auto shrink-0">
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
        </div>
      </div>

      <div className={toolbarFilterRowClass}>
        <MonitorTypePills typeFilter={typeFilter} onTypeFilterChange={onTypeFilterChange} />
        <div className="ml-auto shrink-0">
          <EventFilterButton scope="live" filters={listFilters} onApplyFilters={onApplyFilters} />
        </div>
      </div>

      <style>{`@keyframes evt-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>
    </div>
  )
}
