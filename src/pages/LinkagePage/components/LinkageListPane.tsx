import { SearchField } from '@/components/primitive/SearchField'
import { Badge } from '@/components/primitive/Badge'
import { linkageRuleSummary } from '@/pages/LinkagePage/utils/linkageDisplay'
import type { LinkageRule } from '@/pages/LinkagePage/linkageTypes'

interface LinkageListPaneProps {
  rules: LinkageRule[]
  selectedId: number | null
  searchQuery: string
  onSearch: (query: string) => void
  onSelect: (rule: LinkageRule) => void
}

export const LinkageListPane = ({
  rules,
  selectedId,
  searchQuery,
  onSearch,
  onSelect,
}: LinkageListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 280, borderRight: '0.5px solid var(--color-border)' }}
  >
    <div
      className="flex-shrink-0"
      style={{
        padding: '8px 12px 6px',
        background: 'var(--color-sidebar)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <p
        className="app-text-md font-medium mb-1.5 tracking-wide"
        style={{ color: 'var(--color-text-subtle)' }}
      >
        연동 규칙
      </p>
      <SearchField value={searchQuery} placeholder="명칭 검색..." onChange={onSearch} />
    </div>

    <div className="flex-1 overflow-y-auto app-scrollbar">
      {rules.length === 0 ? (
        <p
          className="app-text-md text-center py-8 px-3"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 연동 규칙이 없습니다.'}
        </p>
      ) : (
        rules.map((rule) => {
          const isSelected = rule.id === selectedId
          return (
            <div
              key={rule.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(rule)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(rule)
                }
              }}
              className="px-3.5 py-2.5 cursor-pointer"
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
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span
                    className="app-text-md font-medium block truncate"
                    style={{ color: 'var(--color-text)' }}
                  >
                    {rule.name}
                  </span>
                  <span
                    className="app-text-sm block mt-0.5 truncate"
                    style={{ color: 'var(--color-text-subtle)' }}
                  >
                    {linkageRuleSummary(rule)}
                  </span>
                </div>
                <Badge variant={rule.active ? 'on' : 'off'}>
                  {rule.active ? '활성' : '비활성'}
                </Badge>
              </div>
            </div>
          )
        })
      )}
    </div>

    <div
      className="flex-shrink-0 app-text-md px-3 py-1.5"
      style={{
        background: 'var(--color-sidebar)',
        borderTop: '0.5px solid var(--color-border)',
        color: 'var(--color-text-dim)',
      }}
    >
      전체 {rules.length}건
    </div>
  </div>
)
