import { useMemo } from 'react'
import { Badge } from '@/components/primitive/Badge'
import { EmpPhotoSlot } from '@/pages/EmpsPage/components/EmpPhotoSlot'
import { empNoDisplay } from '@/pages/EmpsPage/utils/empHelpers'
import type { ColumnDef } from '@/components/primitive/Grid'
import type { EmpInfo } from '@/types/api'

const FONT_SIZE = 15

export const useEmpColumns = (empCardCountMap: Record<number, number>) =>
  useMemo<ColumnDef<EmpInfo>[]>(
    () => [
      {
        key: 'photo',
        header: '',
        width: 44,
        sortable: false,
        hideable: false,
        render: (_, row) => <EmpPhotoSlot variant="grid" photoUrl={row.photoUrl} />,
      },
      {
        key: 'name',
        header: '이름',
        width: 120,
        sortable: true,
        hideable: false,
        render: (value) => (
          <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
            {String(value ?? '')}
          </span>
        ),
      },
      {
        key: 'udef',
        header: '사번',
        width: 80,
        sortable: true,
        render: (value) => (
          <span className="font-mono truncate block" style={{ fontSize: FONT_SIZE }}>
            {empNoDisplay(String(value ?? ''))}
          </span>
        ),
      },
      {
        key: 'dept',
        header: '부서',
        width: 90,
        sortable: true,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {Number.isFinite(n) && n !== 0 ? String(n) : '—'}
            </span>
          )
        },
      },
      {
        key: 'lv',
        header: '직급',
        width: 60,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {Number.isFinite(n) && n !== 0 ? String(n) : '—'}
            </span>
          )
        },
      },
      {
        key: 'email',
        header: '이메일',
        width: 140,
        render: (value) =>
          value && String(value).trim() !== '' ? (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {String(value)}
            </span>
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
