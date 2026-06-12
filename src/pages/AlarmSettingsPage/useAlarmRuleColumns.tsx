import { type ColumnDef } from '@/components/primitive/Grid'
import type { AlarmRuleDisplay } from '@/pages/AlarmSettingsPage/alarmRuleTypes'
import {
  deviceNameForRule,
  eventCodeLabel,
  isRuleDisabled,
  scpNameForRule,
} from '@/pages/AlarmSettingsPage/utils/alarmRuleDisplay'

export const buildAlarmRuleColumns = (
  scpNameMap: Record<number, string>,
): ColumnDef<AlarmRuleDisplay>[] => [
  {
    key: 'name',
    header: '명칭',
    width: 160,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '사용 안함',
    width: 72,
    align: 'center',
    sortable: true,
    render: (_, row) =>
      isRuleDisabled(row) ? (
        <span style={{ color: 'var(--color-accent)' }}>✓</span>
      ) : null,
  },
  {
    key: 'priority',
    header: '우선순위',
    width: 72,
    align: 'center',
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'eventCode',
    header: '이벤트',
    width: 180,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {eventCodeLabel(String(value ?? ''))}
      </span>
    ),
  },
  {
    key: 'scpId',
    header: '컨트롤러',
    width: 120,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {scpNameForRule(row, scpNameMap)}
      </span>
    ),
  },
  {
    key: 'deviceId',
    header: '장치',
    width: 120,
    sortable: true,
    render: (_, row) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text-muted)' }}>
        {deviceNameForRule(row, scpNameMap)}
      </span>
    ),
  },
]
