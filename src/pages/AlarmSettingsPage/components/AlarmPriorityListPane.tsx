import { AlarmPrioritySamplePreview } from '@/pages/AlarmSettingsPage/components/AlarmPrioritySamplePreview'
import type { AlarmPriorityDisplay } from '@/pages/AlarmSettingsPage/alarmPriorityTypes'
import { normalizeHexColor } from '@/pages/AlarmSettingsPage/utils/alarmHelpers'

interface AlarmPriorityListPaneProps {
  items: AlarmPriorityDisplay[]
  selectedId: number | null
  loading: boolean
  error: boolean
  onSelect: (item: AlarmPriorityDisplay) => void
}

export const AlarmPriorityListPane = ({
  items,
  selectedId,
  loading,
  error,
  onSelect,
}: AlarmPriorityListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 240, borderRight: '0.5px solid var(--color-border)' }}
  >
    <div className="flex-1 overflow-y-auto app-scrollbar">
      {loading ? (
        <p className="text-[14px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
          불러오는 중...
        </p>
      ) : error ? (
        <p className="text-[14px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
          우선순위 목록을 불러오지 못했습니다.
        </p>
      ) : items.length === 0 ? (
        <p className="text-[14px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
          등록된 우선순위가 없습니다.
        </p>
      ) : (
        items.map((item) => {
          const isSelected = item.id === selectedId
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
              className="px-3 py-2 cursor-pointer"
              style={{
                background: isSelected ? 'var(--color-row-selected)' : 'transparent',
                borderBottom: '0.5px solid var(--color-border-subtle)',
                borderRight: isSelected
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--color-btn-hover)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = isSelected
                  ? 'var(--color-row-selected)'
                  : 'transparent'
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="text-[14px] font-mono font-medium w-8 shrink-0"
                  style={{ color: 'var(--color-text)' }}
                >
                  {item.priority}
                </span>
                <AlarmPrioritySamplePreview
                  fgColor={normalizeHexColor(item.alarmFg)}
                  bgColor={normalizeHexColor(item.alarmBg)}
                  bgEnabled={item.alarmBgEnabled}
                  blinking={item.blinking}
                  compact
                />
              </div>
            </div>
          )
        })
      )}
    </div>

    <div
      className="flex-shrink-0 flex items-center text-[13px]"
      style={{
        padding: '5px 12px',
        background: 'var(--color-sidebar)',
        borderTop: '0.5px solid var(--color-border)',
        color: 'var(--color-text-dim)',
      }}
    >
      전체 {items.length}건
    </div>
  </div>
)
