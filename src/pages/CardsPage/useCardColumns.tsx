import { useMemo } from 'react'
import { Badge } from '@/components/ui/Badge'
import { typeBadgeVariant } from '@/pages/CardsPage/components/CardFieldUi'
import { cardStatusLabel, cardTypeLabel, type CardRow } from '@/pages/CardsPage/utils/cardPageHelpers'
import type { ColumnDef } from '@/components/ui/Grid'

export const useCardColumns = (empNameMap: Record<number, string>) =>
  useMemo<ColumnDef<CardRow>[]>(
    () => [
      {
        key: 'id',
        header: 'ID',
        width: 50,
        render: (value) => (
          <span style={{ fontSize: 11, color: 'var(--color-text-dim)', fontFamily: 'monospace' }}>
            {String(value)}
          </span>
        ),
      },
      {
        key: 'name',
        header: '명칭',
        width: 90,
        render: (_, row) => (row.name?.trim() ? row.name : '—'),
      },
      {
        key: 'cardNumber',
        header: '카드 번호',
        width: 110,
        render: (value) => (
          <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{String(value ?? '')}</span>
        ),
      },
      {
        key: 'empId',
        header: '카드 사용자',
        width: 90,
        render: (value, row) => {
          if (value == null) return '—'
          return empNameMap[value as number] ?? row.empName ?? '—'
        },
      },
      {
        key: 'type',
        header: '유형',
        width: 72,
        render: (_, row) => (
          <Badge variant={typeBadgeVariant(cardTypeLabel(row))}>{cardTypeLabel(row)}</Badge>
        ),
      },
      {
        key: 'isActive',
        header: '상태',
        width: 72,
        render: (_, row) => (
          <Badge variant={cardStatusLabel(row) === '활성' ? 'on' : 'off'}>{cardStatusLabel(row)}</Badge>
        ),
      },
      {
        key: 'lastAccess',
        header: '마지막 접근 일시',
        width: 130,
        render: (_, row) => (row.lastAccess?.trim() ? row.lastAccess : '—'),
      },
    ],
    [empNameMap],
  )
