import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AccLvReaderRow } from '@/pages/AccessPage/utils/accLvHelpers'

interface AccLvReaderTableProps {
  rows: AccLvReaderRow[]
  loading?: boolean
}

export const AccLvReaderTable = ({ rows, loading = false }: AccLvReaderTableProps) => {
  const { t } = useTranslation('access')
  const [hovered, setHovered] = useState<number | null>(null)

  const headers = useMemo(
    () => [
      t('readers.column.controller'),
      t('readers.column.reader'),
      t('readers.column.timezone'),
    ],
    [t],
  )

  if (loading) {
    return (
      <p className="text-[14px] py-4" style={{ color: 'var(--color-text-subtle)' }}>
        {t('loading')}
      </p>
    )
  }

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          {headers.map((header) => (
            <th
              key={header}
              className="text-[13px] font-medium py-2 px-2.5 text-left"
              style={{
                color: 'var(--color-text-subtle)',
                borderBottom: '0.5px solid var(--color-border)',
                background: 'var(--color-btn-hover)',
              }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={3}
              className="text-[14px] py-6 px-2.5 text-center"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              {t('readers.empty')}
            </td>
          </tr>
        ) : (
          rows.map((row, idx) => {
            const isLast = idx === rows.length - 1
            return (
              <tr
                key={`${row.scpId}-${row.readerId}-${idx}`}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === idx ? 'var(--color-btn-hover)' : 'transparent',
                }}
              >
                <td
                  className="text-[14px] py-2 px-2.5"
                  style={{
                    color: 'var(--color-text)',
                    borderBottom: isLast ? 'none' : '0.5px solid var(--color-border-subtle)',
                  }}
                >
                  {row.scpName}
                </td>
                <td
                  className="text-[14px] py-2 px-2.5"
                  style={{
                    color: 'var(--color-text)',
                    borderBottom: isLast ? 'none' : '0.5px solid var(--color-border-subtle)',
                  }}
                >
                  {row.readerName}
                </td>
                <td
                  className="text-[14px] py-2 px-2.5"
                  style={{
                    color: 'var(--color-text-muted)',
                    borderBottom: isLast ? 'none' : '0.5px solid var(--color-border-subtle)',
                  }}
                >
                  {row.timezoneName}
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}
