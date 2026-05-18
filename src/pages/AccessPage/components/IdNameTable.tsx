import { useState } from 'react'

interface IdNameTableProps {
  rows: { id: number; name: string }[]
}

export const IdNameTable = ({ rows }: IdNameTableProps) => {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th
            className="text-[10px] font-medium py-1.5 px-2 text-left border-b border-[#21252b]"
            style={{ color: '#3a3f4a' }}
          >
            ID
          </th>
          <th
            className="text-[10px] font-medium py-1.5 px-2 text-left border-b border-[#21252b]"
            style={{ color: '#3a3f4a' }}
          >
            명칭
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={2}
              className="text-[12px] py-2 px-2"
              style={{ color: 'var(--color-text-subtle)' }}
            >
              —
            </td>
          </tr>
        ) : (
          rows.map((row, idx) => {
            const isLast = idx === rows.length - 1
            return (
              <tr
                key={`${row.id}-${idx}`}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: hovered === idx ? 'var(--color-btn-hover)' : 'transparent',
                }}
              >
                <td
                  className="py-1.5 px-2 font-mono text-[11px]"
                  style={{
                    color: '#555a63',
                    borderBottom: isLast ? 'none' : '1px solid #1e2127',
                  }}
                >
                  {row.id}
                </td>
                <td
                  className="text-[12px] py-1.5 px-2"
                  style={{
                    color: 'var(--color-text)',
                    borderBottom: isLast ? 'none' : '1px solid #1e2127',
                  }}
                >
                  {row.name}
                </td>
              </tr>
            )
          })
        )}
      </tbody>
    </table>
  )
}
