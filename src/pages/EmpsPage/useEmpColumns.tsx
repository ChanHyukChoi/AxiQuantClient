import { useMemo } from 'react'
import { Badge } from '@/components/primitive/Badge'
import { Avatar } from '@/pages/EmpsPage/components/EmpFieldUi'
import type { ColumnDef } from '@/components/primitive/Grid'
import type { EmpInfo } from '@/types/api'

export const useEmpColumns = (empCardCountMap: Record<number, number>) =>
  useMemo<ColumnDef<EmpInfo>[]>(
    () => [
      {
        key: 'id',
        header: 'ID',
        width: 50,
        render: (value) => (
          <span
            style={{
              fontSize: 11,
              color: 'var(--color-text-dim)',
              fontFamily: 'monospace',
            }}
          >
            {String(value)}
          </span>
        ),
      },
      {
        key: 'name',
        header: '이름',
        width: 120,
        render: (_, row) => (
          <div className="flex items-center gap-2">
            <Avatar name={row.name} size={26} />
            <span>{row.name}</span>
          </div>
        ),
      },
      {
        key: 'udef',
        header: '사번',
        width: 70,
        render: (value) =>
          value ? (
            <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{String(value)}</span>
          ) : (
            '—'
          ),
      },
      {
        key: 'dept',
        header: '부서',
        width: 90,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return Number.isFinite(n) && n !== 0 ? String(n) : '—'
        },
      },
      {
        key: 'lv',
        header: '직급',
        width: 60,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return Number.isFinite(n) && n !== 0 ? String(n) : '—'
        },
      },
      {
        key: 'email',
        header: '이메일',
        width: 140,
        render: (value) =>
          value && String(value).trim() !== '' ? (
            <span style={{ fontSize: 11 }}>{String(value)}</span>
          ) : (
            '—'
          ),
      },
      {
        key: 'cardCount',
        header: '카드',
        width: 60,
        render: (_, row) => {
          const count = empCardCountMap[row.id] ?? 0
          return count === 0 ? (
            <Badge variant="off">없음</Badge>
          ) : (
            <Badge variant="on">{count}장</Badge>
          )
        },
      },
    ],
    [empCardCountMap],
  )
