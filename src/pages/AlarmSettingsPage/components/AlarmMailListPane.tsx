import type { AlarmMailInfo } from '@/types/api'

interface AlarmMailListPaneProps {
  items: AlarmMailInfo[]
  selectedId: number | null
  loading: boolean
  error: boolean
  onSelect: (item: AlarmMailInfo) => void
}

export const AlarmMailListPane = ({
  items,
  selectedId,
  loading,
  error,
  onSelect,
}: AlarmMailListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 220, borderRight: '0.5px solid var(--color-border)' }}
  >
    <div className="flex-1 overflow-y-auto app-scrollbar">
      {loading ? (
        <p className="text-[14px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
          불러오는 중...
        </p>
      ) : error ? (
        <p className="text-[14px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
          이메일 경보 목록을 불러오지 못했습니다.
        </p>
      ) : items.length === 0 ? (
        <p className="text-[14px] text-center py-8" style={{ color: 'var(--color-text-subtle)' }}>
          등록된 이메일 경보가 없습니다.
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
              <span
                className="text-[14px] font-medium truncate block"
                style={{ color: 'var(--color-text)' }}
              >
                {item.name?.trim() || '이메일 경보'}
              </span>
              <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-subtle)' }}>
                경보 {item.alarmIds?.length ?? 0} · 수신자 {item.emails?.length ?? 0}
              </p>
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
