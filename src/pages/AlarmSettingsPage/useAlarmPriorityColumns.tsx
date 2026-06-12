import { type ColumnDef } from '@/components/primitive/Grid'
import { AlarmPrioritySamplePreview } from '@/pages/AlarmSettingsPage/components/AlarmPrioritySamplePreview'
import type { AlarmPriorityDisplay } from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import { normalizeHexColor } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'

export const useAlarmPriorityColumns = (): ColumnDef<AlarmPriorityDisplay>[] => [
  {
    key: 'priority',
    header: '우선순위',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'alarmFg',
    header: '경보',
    width: 140,
    sortable: false,
    render: (_, row) => (
      <AlarmPrioritySamplePreview
        fgColor={normalizeHexColor(row.alarmFg)}
        bgColor={normalizeHexColor(row.alarmBg)}
        bgEnabled={row.alarmBgEnabled}
        blinking={row.blinking}
        compact
      />
    ),
  },
  {
    key: 'ackFg',
    header: '인지 처리 후',
    width: 140,
    sortable: false,
    render: (_, row) => (
      <AlarmPrioritySamplePreview
        fgColor={normalizeHexColor(row.ackFg)}
        bgColor={normalizeHexColor(row.ackBg)}
        bgEnabled={row.ackBgEnabled}
        compact
      />
    ),
  },
]
