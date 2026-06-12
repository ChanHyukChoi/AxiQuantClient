import { type ColumnDef } from '@/components/primitive/Grid'
import { fallbackUserName } from '@/lib/entityDisplayLabels'
import type { UserInfo } from '@/types/api/user'

export const useUserColumns = (): ColumnDef<UserInfo>[] => [
  {
    key: 'loginId',
    header: '로그인 ID',
    width: 120,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] font-mono truncate block" style={{ color: 'var(--color-text)' }}>
        {String(value ?? '')}
      </span>
    ),
  },
  {
    key: 'name',
    header: '명칭',
    width: 140,
    sortable: true,
    render: (value) => (
      <span className="text-[14px] truncate block" style={{ color: 'var(--color-text)' }}>
        {fallbackUserName(typeof value === 'string' ? value : '')}
      </span>
    ),
  },
  {
    key: 'active',
    header: '활성',
    width: 64,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
  {
    key: 'useExternalApi',
    header: '외부 API',
    width: 80,
    align: 'center',
    sortable: true,
    render: (value) =>
      value ? <span style={{ color: 'var(--color-accent)' }}>✓</span> : null,
  },
]
