import { ExportButton, PrintButton } from '@/components/page-actions'
import { ACTION_TYPE_OPTIONS, DATA_TYPE_OPTIONS } from '@/pages/AuditLogPage/utils/auditBadge'
import type { DatePreset } from '@/pages/EventMonitorPage/utils/dateRange'
import type { UserInfo } from '@/types/api/user'

interface AuditToolbarProps {
  datePreset: DatePreset
  onDatePresetChange: (p: DatePreset) => void
  dateFrom: string
  dateTo: string
  onDateFromChange: (v: string) => void
  onDateToChange: (v: string) => void
  userId: number | ''
  onUserIdChange: (id: number | '') => void
  users: UserInfo[]
  actionType: string
  onActionTypeChange: (v: string) => void
  dataType: string
  onDataTypeChange: (v: string) => void
  onExport: () => void
  onPrint: () => void
}

const presetBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'var(--color-btn-hover)' : 'transparent',
  color: active ? 'var(--color-text)' : 'var(--color-text-muted)',
  border: '0.5px solid var(--color-btn-default-border)',
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 4,
  cursor: 'pointer',
})

const selectStyle: React.CSSProperties = {
  background: 'var(--color-btn-hover)',
  border: '0.5px solid var(--color-btn-default-border)',
  color: 'var(--color-text)',
  fontSize: 12,
  padding: '4px 8px',
  borderRadius: 4,
}

export const AuditToolbar = ({
  datePreset,
  onDatePresetChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  userId,
  onUserIdChange,
  users,
  actionType,
  onActionTypeChange,
  dataType,
  onDataTypeChange,
  onExport,
  onPrint,
}: AuditToolbarProps) => (
  <div
    className="flex flex-col flex-shrink-0 gap-2 px-3 py-2"
    style={{ background: 'var(--color-sidebar)', borderBottom: '0.5px solid var(--color-border)' }}
  >
    <div className="flex items-center gap-2 flex-wrap">
      {(
        [
          ['today', '??'],
          ['7d', '?? 7?'],
          ['30d', '?? 30?'],
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
        className="text-[11px] px-1.5 py-1 rounded"
        style={selectStyle}
      />
      <span className="text-[11px]" style={{ color: 'var(--color-text-dim)' }}>
        ~
      </span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => {
          onDatePresetChange('custom')
          onDateToChange(e.target.value)
        }}
        className="text-[11px] px-1.5 py-1 rounded"
        style={selectStyle}
      />

      <select
        value={userId === '' ? '' : String(userId)}
        onChange={(e) => onUserIdChange(e.target.value === '' ? '' : Number(e.target.value))}
        style={{ ...selectStyle, minWidth: 120 }}
      >
        <option value="">??? ??</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.loginId})
          </option>
        ))}
      </select>

      <select value={actionType} onChange={(e) => onActionTypeChange(e.target.value)} style={selectStyle}>
        <option value="">?? ??</option>
        {ACTION_TYPE_OPTIONS.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>

      <select value={dataType} onChange={(e) => onDataTypeChange(e.target.value)} style={selectStyle}>
        <option value="">??? ??</option>
        {DATA_TYPE_OPTIONS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1 ml-auto">
        <ExportButton size="sm" showLabel={false} onClick={onExport} />
        <PrintButton size="sm" showLabel={false} onClick={onPrint} />
      </div>
    </div>
  </div>
)
