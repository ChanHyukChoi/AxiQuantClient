import { ExportButton, PrintButton, SearchButton } from '@/components/page-actions'
import { EventFilterButton } from '@/pages/EventMonitorPage/components/EventFilterButton'
import { MonitorDateRange } from '@/pages/EventMonitorPage/components/MonitorDateRange'
import { MonitorTypePills } from '@/pages/EventMonitorPage/components/MonitorTypePills'
import {
  toolbarDateRowClass,
  toolbarFilterRowClass,
  toolbarShellStyle,
} from '@/pages/EventMonitorPage/components/toolbarStyles'
import type { DatePreset } from '@/pages/EventMonitorPage/utils/dateRange'
import type { TypeFilter } from '@/pages/EventMonitorPage/utils/eventFilters'

interface HistoryToolbarBProps {
  typeFilter: TypeFilter
  onTypeFilterChange: (f: TypeFilter) => void
  datePreset: DatePreset
  onDatePresetChange: (p: DatePreset) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  onExport: () => void
  onPrint: () => void
  onSearch: () => void
}

export const HistoryToolbarB = ({
  typeFilter,
  onTypeFilterChange,
  datePreset,
  onDatePresetChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onExport,
  onPrint,
  onSearch,
}: HistoryToolbarBProps) => (
  <div className="flex flex-col flex-shrink-0" style={toolbarShellStyle}>
    <div className={toolbarFilterRowClass}>
      <MonitorTypePills typeFilter={typeFilter} onTypeFilterChange={onTypeFilterChange} />

      <div className="flex items-center gap-1 ml-auto shrink-0">
        <EventFilterButton scope="history" />
        <ExportButton size="sm" showLabel={false} onClick={onExport} />
        <PrintButton size="sm" showLabel={false} onClick={onPrint} />
      </div>
    </div>

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
  </div>
)
