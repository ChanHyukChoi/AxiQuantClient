import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/primitive/Badge'
import { EmpPhotoSlot } from '@/pages/EmpsPage/components/EmpPhotoSlot'
import { empNoDisplay } from '@/pages/EmpsPage/utils/empHelpers'
import type { ColumnDef } from '@/components/primitive/Grid'
import type { EmpInfo } from '@/types/api'

const FONT_SIZE = 15

export const useEmpColumns = (empCardCountMap: Record<number, number>) => {
  const { t } = useTranslation(['emp', 'common'])

  return useMemo<ColumnDef<EmpInfo>[]>(
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
        header: t('emp:field.name'),
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
        header: t('emp:field.empNo'),
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
        header: t('emp:field.dept'),
        width: 90,
        sortable: true,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {Number.isFinite(n) && n !== 0 ? String(n) : t('common:empty')}
            </span>
          )
        },
      },
      {
        key: 'lv',
        header: t('emp:field.lv'),
        width: 60,
        render: (value) => {
          const n = typeof value === 'number' ? value : Number(value)
          return (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {Number.isFinite(n) && n !== 0 ? String(n) : t('common:empty')}
            </span>
          )
        },
      },
      {
        key: 'email',
        header: t('emp:field.email'),
        width: 140,
        render: (value) =>
          value && String(value).trim() !== '' ? (
            <span className="truncate block" style={{ fontSize: FONT_SIZE }}>
              {String(value)}
            </span>
          ) : (
            t('common:empty')
          ),
      },
      {
        key: 'cardCount',
        header: t('emp:field.card'),
        width: 60,
        render: (_, row) => {
          const count = empCardCountMap[row.id] ?? 0
          return count === 0 ? (
            <Badge variant="off">{t('emp:cardNone')}</Badge>
          ) : (
            <Badge variant="on">{t('emp:cardCount', { count })}</Badge>
          )
        },
      },
    ],
    [empCardCountMap, t],
  )
}
