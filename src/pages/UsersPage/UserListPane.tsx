import { SearchField } from '@/components/primitive/SearchField'
import { Badge } from '@/components/primitive/Badge'
import type { UserInfo } from '@/types/api/user'

interface UserListPaneProps {
  users: UserInfo[]
  selectedId: number | null
  searchQuery: string
  loading: boolean
  error: boolean
  onSearch: (query: string) => void
  onSelect: (user: UserInfo) => void
}

export const UserListPane = ({
  users,
  selectedId,
  searchQuery,
  loading,
  error,
  onSearch,
  onSelect,
}: UserListPaneProps) => (
  <div
    className="flex flex-col flex-shrink-0 overflow-hidden"
    style={{ width: 220, borderRight: '0.5px solid var(--color-border)' }}
  >
    <div
      className="flex items-center flex-shrink-0"
      style={{
        padding: '7px 12px',
        background: 'var(--color-sidebar)',
        borderBottom: '0.5px solid var(--color-border)',
      }}
    >
      <SearchField
        value={searchQuery}
        placeholder="명칭, ID 검색..."
        onChange={onSearch}
        className="w-full"
      />
    </div>

    <div className="flex-1 overflow-y-auto app-scrollbar">
      {loading ? (
        <p
          className="text-[12px] text-center py-8"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          불러오는 중...
        </p>
      ) : error ? (
        <p className="text-[12px] text-center py-8 px-3" style={{ color: '#c75c5c' }}>
          사용자 목록을 불러오지 못했습니다.
        </p>
      ) : users.length === 0 ? (
        <p
          className="text-[12px] text-center py-8"
          style={{ color: 'var(--color-text-subtle)' }}
        >
          {searchQuery.trim() ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
        </p>
      ) : (
        users.map((user) => {
          const isSelected = user.id === selectedId
          return (
            <div
              key={user.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(user)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(user)
                }
              }}
              className="px-3 py-2.5 cursor-pointer"
              style={{
                background: isSelected ? 'var(--color-row-selected)' : 'transparent',
                borderBottom: '0.5px solid var(--color-border-subtle)',
                borderRight: isSelected
                  ? '2px solid var(--color-accent)'
                  : '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (!isSelected)
                  (e.currentTarget as HTMLDivElement).style.background =
                    'var(--color-btn-hover)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.background = isSelected
                  ? 'var(--color-row-selected)'
                  : 'transparent'
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[12px] font-medium truncate flex-1 min-w-0"
                  style={{ color: 'var(--color-text)' }}
                >
                  {user.name?.trim() || `사용자 #${user.id}`}
                </span>
                <Badge variant={user.active ? 'on' : 'off'}>
                  {user.active ? '활성' : '비활성'}
                </Badge>
              </div>
              <p
                className="text-[11px] mt-0.5 font-mono truncate"
                style={{ color: 'var(--color-text-subtle)' }}
              >
                {user.loginId}
              </p>
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
      전체 {users.length}건
    </div>
  </div>
)
