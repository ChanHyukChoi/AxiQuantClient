import { normalizeHexColor, sortByPriority } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'
import type { AlarmPriorityInfo } from '@/types/api'

interface AlarmPriorityListPaneProps {
  items: AlarmPriorityInfo[]
  selectedId: number | null
  loading: boolean
  error: boolean
  onSelect: (item: AlarmPriorityInfo) => void
}

export const AlarmPriorityListPane = ({
  items,
  selectedId,
  loading,
  error,
  onSelect,
}: AlarmPriorityListPaneProps) => {
  const sorted = sortByPriority(items)

  return (
    <div
      className="flex flex-col flex-shrink-0 overflow-hidden"
      style={{ width: 220, borderRight: '0.5px solid var(--color-border)' }}
    >
      <div className="flex-1 overflow-y-auto app-scrollbar">
        {loading ? (
          <p className="text-[12px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
            불러오는 중...
          </p>
        ) : error ? (
          <p className="text-[12px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
            우선순위 목록을 불러오지 못했습니다.
          </p>
        ) : sorted.length === 0 ? (
          <p className="text-[12px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
            등록된 우선순위가 없습니다.
          </p>
        ) : (
          sorted.map((item) => {
          const isSelected = item.id === selectedId
          const hex = normalizeHexColor(item.color)
          return (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(item)
                }
              }}
              className="px-3.5 py-2.5 cursor-pointer"
              style={{
                background: isSelected ? 'var(--color-row-selected)' : 'transparent',
                borderBottom: '0.5px solid var(--color-border-subtle)',
                borderRight: isSelected ? '2px solid var(--color-accent)' : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--color-btn-hover)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = isSelected
                  ? 'var(--color-row-selected)'
                  : 'transparent'
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[12px] font-mono font-medium w-8"
                  style={{ color: 'var(--color-text)' }}
                >
                  {item.priority}
                </span>
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: hex }}
                />
                <span
                  className="text-[11px] font-mono truncate flex-1"
                  style={{ color: 'var(--color-text-subtle)' }}
                >
                  {hex}
                </span>
              </div>
            </div>
          )
          })
        )}
      </div>

      <div
        className="flex-shrink-0 flex items-center text-[11px]"
        style={{
          padding: '5px 12px',
          background: 'var(--color-sidebar)',
          borderTop: '0.5px solid var(--color-border)',
          color: 'var(--color-text-dim)',
        }}
      >
        전체 {sorted.length}건
      </div>
    </div>
  )
}
