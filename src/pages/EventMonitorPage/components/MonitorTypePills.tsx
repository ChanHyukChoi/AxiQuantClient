import { pillStyle } from '@/pages/EventMonitorPage/components/toolbarStyles'
import type { TypeFilter } from '@/pages/EventMonitorPage/utils/eventFilters'

interface MonitorTypePillsProps {
  typeFilter: TypeFilter
  onTypeFilterChange: (f: TypeFilter) => void
}

export const MonitorTypePills = ({ typeFilter, onTypeFilterChange }: MonitorTypePillsProps) => (
  <>
    {(['all', 'access', 'alarm'] as const).map((f) => (
      <button
        key={f}
        type="button"
        onClick={() => onTypeFilterChange(f)}
        className="app-text-md font-medium px-2.5 rounded-full"
        style={pillStyle(typeFilter === f, f)}
      >
        {f === 'all' ? '전체' : f === 'access' ? '출입' : '경보'}
      </button>
    ))}
  </>
)
