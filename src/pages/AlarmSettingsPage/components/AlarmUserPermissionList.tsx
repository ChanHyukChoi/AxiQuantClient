import { MultiSelectToggleAllButton } from '@/components/basic/MultiSelectToggleAllButton'
import { Checkbox } from '@/components/primitive/Checkbox'
import { SearchField } from '@/components/primitive/SearchField'
import { MOCK_ALARM_USERS } from '@/pages/AlarmSettingsPage/alarmRulesMockData'
import { useUsers } from '@/hooks/api/useUsers'
import { useMemo, useState } from 'react'

interface AlarmUserPermissionListProps {
  selectedUserIds: number[]
  editMode: boolean
  onToggle: (userId: number, checked: boolean) => void
  onSelectAll: (userIds: number[]) => void
  onDeselectAll: () => void
  useMock?: boolean
}

export const AlarmUserPermissionList = ({
  selectedUserIds,
  editMode,
  onToggle,
  onSelectAll,
  onDeselectAll,
  useMock = false,
}: AlarmUserPermissionListProps) => {
  const [query, setQuery] = useState('')
  const { data: userResult } = useUsers()

  const users = useMemo(() => {
    if (useMock || userResult?.apiNotReady || !userResult?.users.length) {
      return MOCK_ALARM_USERS
    }
    return userResult.users.map((u) => ({
      id: u.id,
      loginId: u.loginId,
      name: u.name || u.loginId,
    }))
  }, [useMock, userResult])

  const filtered = useMemo(() => {
    if (!query.trim()) return users
    const q = query.trim().toLowerCase()
    return users.filter(
      (u) => u.loginId.toLowerCase().includes(q) || u.name.toLowerCase().includes(q),
    )
  }, [users, query])

  const selectedSet = useMemo(() => new Set(selectedUserIds), [selectedUserIds])

  return (
    <div className="flex flex-col h-full min-h-0">
      <div
        className="flex items-center gap-2 flex-shrink-0 px-2 py-1.5"
        style={{ borderBottom: '0.5px solid var(--color-border)' }}
      >
        <div className="flex-1 min-w-0">
          <SearchField value={query} onChange={setQuery} placeholder="사용자 검색..." />
        </div>
        {editMode ? (
          <MultiSelectToggleAllButton
            hasSelection={selectedUserIds.length > 0}
            onSelectAll={() => onSelectAll(filtered.map((u) => u.id))}
            onDeselectAll={onDeselectAll}
            disabled={filtered.length === 0}
          />
        ) : null}
      </div>

      <div
        className="flex-1 overflow-y-auto app-scrollbar min-h-0"
        style={{
          border: '0.5px solid var(--color-border)',
          background: 'var(--color-input-bg)',
        }}
      >
        {filtered.length === 0 ? (
          <p
            className="text-[13px] text-center py-6"
            style={{ color: 'var(--color-text-subtle)' }}
          >
            {query.trim() ? '검색 결과가 없습니다.' : '등록된 사용자가 없습니다.'}
          </p>
        ) : (
          filtered.map((user) => {
            const checked = selectedSet.has(user.id)
            return (
              <label
                key={user.id}
                className="flex items-center gap-2 px-2.5 cursor-pointer"
                style={{
                  minHeight: 28,
                  borderBottom: '0.5px solid var(--color-border-subtle)',
                  opacity: editMode ? 1 : 0.85,
                }}
              >
                <Checkbox
                  checked={checked}
                  disabled={!editMode}
                  onChange={(next) => onToggle(user.id, next)}
                />
                <span
                  className="text-[14px] truncate"
                  style={{ color: 'var(--color-text)' }}
                >
                  {user.loginId}
                </span>
              </label>
            )
          })
        )}
      </div>
    </div>
  )
}
